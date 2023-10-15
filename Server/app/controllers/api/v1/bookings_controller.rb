module Api
    module V1
      class BookingsController < ApplicationController
        before_action :authenticate_user!
  
        def create
          homeowner = find_homeowner
          booking = build_booking(homeowner)
          booking_address = booking.build_address(booking_params[:address_attributes])
          if save_booking(booking, booking_address)
            handle_successful_booking(booking)
          else
            render_error_response("Failed to create booking", :unprocessable_entity, booking.errors)
          end
        rescue ActiveRecord::RecordInvalid => e
          render_error_response(e.message, :unprocessable_entity)
        rescue StandardError => e
          render_error_response(e.message, :internal_server_error)
        end
  
        def show
          user = User.find(params[:id])
          user_bookings = user.bookings
          serialized_user_bookings = user_bookings.map { |booking| serialize_booking(booking) }
          render json: { data: serialized_user_bookings, status: :ok }
        end
  
        def update
          booking = Booking.find(params[:id])
  
          if booking_params[:housemate_id]
            handle_housemate_update(booking)
          else
            handle_homeowner_update(booking)
          end
        end
  
        private
  
        def find_homeowner
          Homeowner.find(booking_params[:homeowner_id])
        end
  
        def build_booking(homeowner)
          scheduled_at = convert_scheduled_at(booking_params[:scheduled_at])
          booking_params[:status] = "PENDING" unless Booking.statuses.include?(booking_params[:status])
          homeowner.bookings.new(
            service_id: booking_params[:service][:id],
            service_title: booking_params[:service][:title],
            scheduled_at: scheduled_at,
            status: booking_params[:status],
            total_cost: booking_params[:total_cost].to_f,
            payment_method: booking_params[:payment_method]
          )
        end
  
        def convert_scheduled_at(datetime_str)
          custom_format = '%I:%M %p %B %e, %Y %A'
          DateTime.strptime(datetime_str, custom_format)
        end
  
        def save_booking(booking, booking_address)
          Booking.transaction do
            booking.save!
            booking_address.save!
            save_booking_services(booking)
          end
        end
  
        def save_booking_services(booking)
          booking_params[:service_details].each do |service_data|
            subservice = Subservice.find(service_data[:id])
            subservice_quantity = service_data[:quantity].to_i || 1
            BookingService.create!(
              price_per_quantity: subservice.price,
              quantity: subservice_quantity,
              title: subservice.title,
              subservice_id: subservice.id,
              service_id: booking.service_id,
              booking_id: booking.id,
              total: subservice.price.to_f * subservice_quantity
            )
          end
        end
  
        def handle_successful_booking(booking)
          serialized_data = serialize_booking(booking)

          find_housemate(serialized_data, "")
        end
  
        def handle_housemate_update(booking)
          housemate = Housemate.find(booking_params[:housemate_id])
          if booking_params[:status] == "ACCEPTED"
            booking.status = booking_params[:status]
            if booking.save
              serialized_data = serialize_booking(booking)
              render json: { data: serialized_data, status: :ok }
            else
              render_error_response("Failed to update booking", :unprocessable_entity, booking.errors)
            end
          else
            serialized_data = serialize_booking(booking)
            find_housemate(serialized_data, housemate.id)
          end
        end
  
        def handle_homeowner_update(booking)
          homeowner = Homeowner.find(booking_params[:homeowner_id])
          booking.status = booking_params[:status]
          if booking.save
            update_homeowner_and_housemate_balances(homeowner, booking)
          else
            render_error_response("Failed to update booking", :unprocessable_entity, booking.errors)
          end
        end
  
        def update_homeowner_and_housemate_balances(homeowner, booking)
          housemate = Housemate.find(booking.housemate_id)
          homeowner.profile.balance -= booking.total_cost
          housemate.profile.balance += booking.total_cost
  
          if homeowner.profile.save && housemate.profile.save
            render json: { data: booking, status: :ok }
          else
            render_error_response("Failed to update balances", :unprocessable_entity)
          end
        end
  
        def find_housemate(booking_data, housemate_id)
          address = booking_data[:address]
          city = address[:city]
          service_id = booking_data[:service][:id]
  
          nearby_housemates = find_nearby_housemates(city, service_id)
  
          if nearby_housemates.empty?
            render_error_response("No nearby available housemate found.", :ok)
          else
            index = housemate_id.present? ? nearby_housemates.find_index { |housemate| housemate[:id] == housemate_id } + 1 : 0
            if index < nearby_housemates.length
              update_booking_housemate(booking, nearby_housemates[index])
            else
              booking.update(housemate_id: "")
              render_error_response("No nearby available housemate found.", :ok)
            end
          end
        end
  
        def find_nearby_housemates(city, service_id)
          Housemate.joins(profile: :address)
            .joins(:housemate_services)
            .where(profiles: { addresses: { city: city } })
            .where(is_active: true)
            .where(housemate_services: { service_id: service_id })
        end
  
        def update_booking_housemate(booking, housemate)
          booking.assign_attributes(housemate_id: housemate.id, status: "IN_PROGRESS")
  
          if booking.save
            serialized_data = serialize_booking(booking)
            render json: { data: serialized_data, status: :ok }
          else
            render_error_response("Failed to update booking", :unprocessable_entity, booking.errors)
          end
        end
  
        def serialize_booking(booking)
          booking_services_data = booking.booking_services.map do |booking_service|
            BookingServiceSerializer.new(booking_service).serializable_hash[:data][:attributes]
          end
          booking_address_data = AddressSerializer.new(booking.address).serializable_hash[:data][:attributes]
          booking_data = BookingSerializer.new(booking).serializable_hash[:data][:attributes]
          booking_data.merge(address: booking_address_data).merge(service_details: booking_services_data)
        end
  
        def render_error_response(message, status, errors = nil)
          response = { error: message, status: status }
          response[:errors] = errors if errors
          render json: response, status: status
        end
  
        def booking_params
          params.require(:booking).permit(
            :scheduled_at,
            :status,
            :total_cost,
            :housemate_id,
            :id,
            :payment_method,
            :homeowner_id,
            service: [:id, :title],
            service_details: [:id, :title, :quantity],
            address_attributes: [
              :address_line_1,
              :barangay,
              :city,
              :province,
              :zip_code
            ]
          )
        end
      end
    end
end  
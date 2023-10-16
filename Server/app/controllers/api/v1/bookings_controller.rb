module Api
    module V1
      class BookingsController < ApplicationController
        before_action :authenticate_user!
        before_action :find_homeowner, only: [:create, :update]
  
        def create
          render_error_response("Insufficient homeowner balance.", :unprocessable_entity) and return if @homeowner.profile.balance.to_f < booking_params[:total_cost].to_f
          booking = build_booking(@homeowner)
          booking_address = booking.build_address(booking_params[:address_attributes])
          handle_successful_booking(booking, @homeowner) if save_booking(booking, booking_address)
        rescue ActiveRecord::RecordInvalid => e
            render_error_response(e.message, :unprocessable_entity)
        end
  
        def show
          user = User.find(params[:id])
          user_bookings = user.bookings
          serialized_user_bookings = user_bookings.map { |booking| serialize_booking(booking) }
          render json: { data: serialized_user_bookings, status: :ok }
        end
  
        def update
          booking = Booking.find(params[:id])
          handle_update(booking)
        end
  
        private
  
        def find_homeowner
          @homeowner = Homeowner.find(booking_params[:homeowner_id])
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
  
        def handle_successful_booking(booking, homeowner)
          remaining_balance = homeowner.profile.balance -= booking[:total_cost].to_f
          homeowner.profile.update(balance: remaining_balance)
          serialized_data = serialize_booking(booking)
          find_housemate(serialized_data, "")
        end
  
        def handle_update(booking)
          housemate = Housemate.find(booking_params[:housemate_id])
          case booking_params[:status]
            when "ACCEPTED"
              booking.update(status: "IN PROGRESS", housemate_id: housemate[:id])
              render_serialized_response(booking, :ok)
            when "REJECTED"
              serialized_data = serialize_booking(booking)
              find_housemate(serialized_data, housemate[:id])
            when "COMPLETED"
              booking.update(status: "COMPLETED")
              update_housemate_balance(housemate, booking)
            else
              render_error_response("Invalid status input.", :unprocessable_entity)
          end
        end
  
        def update_housemate_balance(housemate, booking)
          housemate.profile.balance += booking.total_cost
          render_serialized_response(booking, :ok)
        end
  
        def find_nearby_housemates(city, service_id)
          Housemate.joins(profile: :address)
            .joins(:housemate_services)
            .where(profiles: { addresses: { city: city } })
            .where(is_active: true)
            .where(housemate_services: { service_id: service_id })
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
            booking = Booking.find(booking_data[:id])
            if index < nearby_housemates.length
              booking.assign_attributes(housemate_id: nearby_housemates[index].id, status: "PENDING")
              booking.save
              render_serialized_response(booking, :ok)
            else
              booking.update(housemate_id: "")
              render_error_response("No nearby available housemate found.", :ok)
            end
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
  
        def render_serialized_response(data, status)
          serialized_data = serialize_booking(data)
          render json: { data: serialized_data }, status: status
        end

        def render_error_response(message, status, errors = nil)
          response = { error: message }
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
module Api
    module V1
        class BookingsController < ApplicationController
            require 'date'
            before_action :authenticate_user!
        
            def create
                homeowner = Homeowner.find(booking_params[:homeowner_id])
        
                custom_format = '%I:%M %p %B %e, %Y %A'
                converted_scheduled_at = DateTime.strptime(booking_params[:scheduled_at], custom_format)
        
                booking = homeowner.bookings.new(
                    service_id: booking_params[:service][:id],
                    service_title: booking_params[:service][:title],
                    scheduled_at: converted_scheduled_at,
                    status: "PENDING",
                    total_cost: booking_params[:total_cost].to_f,
                    payment_method: booking_params[:payment_method],
                )
        
                booking_address = booking.build_address(booking_params[:address_attributes])
        
                if booking.save && booking_address.save
                    service = Service.find(booking_params[:service][:id])
                    service_details = []
                    
                    booking_params[:service_details].each do |service_data|
                        subservice = Subservice.find(service_data[:id])
                        subservice_quantity = service_data[:quantity].nil? ? 1 : service_data[:quantity].to_i
                        service_details << BookingService.new(
                            price_per_quantity: subservice.price,
                            quantity: subservice_quantity,
                            title: subservice.title,
                            subservice_id: subservice.id,
                            service_id: service.id,
                            booking_id: booking.id,
                            total: subservice.price.to_f * subservice_quantity,
                        )
                    end
                    BookingService.transaction do
                        service_details.each(&:save!)
                    end 
        
                    serialized_data = serialize_data(booking)
        
                    find_housemate(serialized_data, "")
                else
                    render json: { errors: booking.errors, status: :unprocessable_entity }
                end
            end
        
            def show
                user = User.find(params[:id])
                if params.has_key?(:booking) && booking_params[:status] === "PENDING"
                    user_bookings = user.bookings.where(status: "PENDING").all
                else
                    user_bookings = user.bookings.all
                end
                serialized_user_bookings = user_bookings.map do |housemate_booking|
                    serialize_data(housemate_booking)
                end
                
                render json: { data: serialized_user_bookings, status: :ok }
            end
        
            def update
                unless Booking.statuses.include?(booking_params[:status])
                    render json: { error: "Please input a valid status." , status: :unprocessable_entity }
                    return
                end
        
                booking = Booking.find(params[:id])
        
                if booking_params[:housemate_id]
                    housemate = Housemate.find(booking_params[:housemate_id])
                    if booking_params[:status] === "ACCEPTED"
                        booking.assign_attributes(status: booking_params[:status])
        
                        if booking.save
                            serialized_data = serialize_data(booking)
                            render json: { data: serialized_data, status: :ok }
                        else
                            render json: { errors: booking.errors, status: :unprocessable_entity }
                        end
                    else
                        serialized_data = serialize_data(booking)
                        find_housemate(serialized_data, housemate[:id])           
                    end
                else
                    homeowner = Homeowner.find(booking_params[:homeowner_id])
                    booking.assign_attributes(status: booking_params[:status])
                    
                    if booking.save
                        housemate = Housemate.find(booking[:housemate_id])
                        homeowner.profile.assign_attributes(balance: homeowner.profile[:balance] - booking[:total_cost])
                        housemate.profile.assign_attributes(balance: housemate.profile[:balance] + booking[:total_cost])
        
                        render json: { data: booking, status: :ok }
                    else
                        render json: { errors: booking.errors, status: :unprocessable_entity }
                    end
                end
            end
        
            private
        
            def find_housemate(booking_data, housemate_id)
                address = booking_data[:address]
                city = address[:city]
                service_id = booking_data[:service][:id]
        
                nearby_housemates = Housemate.joins(profile: :address).joins(:housemate_services)
                    .where(profiles: { addresses: { city: city } })
                    .where(is_active: true)
                    .where(housemate_services: { service_id: service_id })
        
                if nearby_housemates.empty?
                    render json: { errors: "No nearby available housemate found.", status: :unprocessable_entity }
                else
                    index = housemate_id.present? ? nearby_housemates.find_index { |housemate| housemate[:id] == housemate_id } + 1 : 0
                    booking = Booking.find(booking_data[:id])
        
                    if index < nearby_housemates.length
                        booking.assign_attributes(housemate_id: nearby_housemates[index][:id])
                    else
                        booking.update(housemate_id: "")
                        render json: { errors: "No nearby available housemate found.", status: :unprocessable_entity }
                        return
                    end
        
                    if booking.save
                        serialized_data = serialize_data(booking)
                        render json: { data: serialized_data, status: :ok }
                    else
                        render json: { errors: booking.errors, status: :unprocessable_entity }
                    end
                end
            end
        
            def serialize_data(booking)
                booking_services_data = booking.booking_services.all.each do |booking_service|
                    BookingServiceSerializer.new(booking_service).serializable_hash[:data][:attributes]
                end
                booking_address_data = AddressSerializer.new(booking.address).serializable_hash[:data][:attributes]
                booking_data = BookingSerializer.new(booking).serializable_hash[:data][:attributes]
                booking_data.merge(address: booking_address_data).merge(service_details: booking_services_data)
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
                    service: [ :id, :title ],
                    service_details: [ :id, :title, :quantity ],
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
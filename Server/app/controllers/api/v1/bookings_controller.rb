class Api::V1::BookingsController < ApplicationController
    require 'date'

    def create
        homeowner = Homeowner.find(booking_params[:homeowner_id])

        custom_format = '%I:%M %p %B %e, %Y %A'
        converted_scheduled_at = DateTime.strptime(booking_params[:scheduled_at], custom_format)

        booking = homeowner.bookings.new(
            service_title: booking_params[:service_title],
            scheduled_at: converted_scheduled_at,
            status: "PENDING",
            total_cost: booking_params[:total_cost].to_f,
            payment_method: booking_params[:payment_method],
        )

        booking_address = booking.build_address(booking_params[:address_attributes])

        if booking.save && booking_address.save
            
            service = Service.find_by(title: booking_params[:service_title])
            service_details = []
            
            booking_params[:service_details].each do |service_data|
                subservice = Subservice.find_by(title: service_data[:title])
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

            booking_services_data = booking.booking_services.all.each do |booking_service|
                BookingServiceSerializer.new(booking_service).serializable_hash[:data][:attributes]
            end

            address_data = AddressSerializer.new(booking_address).serializable_hash[:data][:attributes]
            booking_data = BookingSerializer.new(booking).serializable_hash[:data][:attributes]
        
            combined_data = booking_data.merge(address: address_data).merge(service_details: booking_services_data)

            render json: { data: combined_data, status: :created }
        else
            render json: { errors: booking.errors, status: :unprocessable_entity }
        end
    end

    private

    def booking_params
        params.require(:booking).permit(
            :scheduled_at,
            :status,
            :total_cost,
            :housemate_id,
            :payment_method,
            :homeowner_id,
            :service_title,
            service_details: [
                :title,
                :quantity
            ],
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

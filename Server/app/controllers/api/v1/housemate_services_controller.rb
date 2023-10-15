module Api
    module V1
        class HousemateServicesController < ApplicationController
            before_action :authenticate_user!
            
            def create
                housemate = Housemate.find(housemate_services_params[:id])

                begin
                    housemate_services = []
                    housemate_services_params[:services].each do |housemate_service|
                      housemate_services << housemate.housemate_services.new(
                        email: housemate.email,
                        service_id: housemate_service[:id],
                        service_title: housemate_service[:title])
                    end
                    HousemateService.transaction do
                      housemate_services.each(&:save!)
                    end 
                    housemate_services_data = housemate.housemate_services.all.each do |house_service|
                      HousemateServiceSerializer.new(house_service).serializable_hash[:data][:attributes]
                    end
                    render json: { data: housemate_services_data }, status: :created
                  rescue ActiveRecord::RecordInvalid => e
                    render json: { error: e.message }, status: :unprocessable_entity
                  rescue StandardError => e
                    render json: { error: e.message }, status: :internal_server_error
                  end
            end

            private 

            def housemate_services_params
                params.require(:housemate_service).permit(:id, :email, services: [ :id, :title ])
            end
        end
    end
end
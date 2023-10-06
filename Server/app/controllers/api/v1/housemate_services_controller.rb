module Api
    module V1
        class HousemateServicesController < ApplicationController

            def create
                housemate = Housemate.find_by(email: housemate_services_params[:email])
                housemate_services = housemate_services_params[:services]

                created_housemate_services = []

                begin
                    housemate.housemate_services.transaction do
                      housemate_services.each do |service|
                        created_housemate_services << housemate.housemate_services.new(email: housemate.email,service_title: service)
                      end
                      created_housemate_services.each(&:save!)
                    end
                    render json: { data: housemate.housemate_services.all, status: :created }
                  rescue ActiveRecord::RecordInvalid => e
                    render json: { error: e.message, status: :unprocessable_entity }
                  rescue StandardError => e
                    render json: { error: e.message, status: :internal_server_error }
                  end
            end

            private 

            def housemate_services_params
                params.require(:housemate_service).permit(:email, :services=> [])
            end
        end
    end
end
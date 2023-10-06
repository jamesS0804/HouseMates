module Api
    module V1
        class ServicesController < ApplicationController
            respond_to :json
            
            def create
                service = Service.new(service_params)
                if service.save
                    render json: { data: service, status: :created }
                else
                    render json: { errors: service.errors, status: :unprocessable_entity }
                end
            end
        
            private
        
            def service_params
                params.require(:service).permit(:title, :price)
            end
        end
    end
end


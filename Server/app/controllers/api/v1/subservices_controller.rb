module Api
    module V1
        class SubservicesController < ApplicationController
            respond_to :json
            
            def create
                service = Service.find_by(title: subservice_params[:service_title])
                subservice = service.subservices.new(subservice_params)
                if subservice.save
                    render json: { data: subservice, status: :created }
                else
                    render json: { errors: subservice.errors, status: :unprocessable_entity }
                end
            end
        
            def show
                service = Service.find_by(title: params[:service_title])
                subservices = service.subservices.all
                render json: { data: subservices, status: :ok } 
            end

            private
        
            def subservice_params
                params.require(:subservice).permit(:service_title, :title, :price)
            end
        end
    end
end
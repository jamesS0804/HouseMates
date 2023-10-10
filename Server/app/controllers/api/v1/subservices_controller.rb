module Api
    module V1
        class SubservicesController < ApplicationController
            respond_to :json
            
            def create
                service = Service.find(subservice_params[:service_id])
                subservice = service.subservices.new(subservice_params)
                if subservice.save
                    render_subservice_json(subservice, :created)
                else
                    render json: { errors: subservice.errors, status: :unprocessable_entity }
                end
            end
        
            def show
                service = Service.find(params[:id])
                subservices = service.subservices.all
                render_subservice_json(subservices, :ok)
            end

            private
        
            def serialize_subservices(subservices)
                ServiceSerializer.new(subservices).serializable_hash[:data].map { |data| data[:attributes] }
            end

            def render_subservice_json(subservices, status)
                serialized_data = serialize_subservices(subservices)
                render json: { data: serialized_data, status: status }
            end

            def subservice_params
                params.require(:subservice).permit(:service_id, :service_title, :title, :price)
            end
        end
    end
end
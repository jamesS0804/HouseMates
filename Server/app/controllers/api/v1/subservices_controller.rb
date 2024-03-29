module Api
    module V1
        class SubservicesController < ApplicationController
            respond_to :json
            before_action :authenticate_user!
            
            def create
                service = Service.find(subservice_params[:service_id])
                subservice = service.subservices.new(subservice_params)
                if subservice.save
                    render_subservice_json(subservice, :created)
                else
                    render json: { errors: subservice.errors }, status: :unprocessable_entity
                end
            end
        
            def show
                service = Service.find(params[:id])
                subservices = service.subservices.all
                render_subservice_json(subservices, :ok)
            end

            def update
                subservice = Subservice.find(params[:id])
                if subservice.update(subservice_params)
                    render_subservice_json(subservice, :ok)
                else
                    render json: { errors: subservice.errors }, status: :unprocessable_entity
                end
            end

            private
        
            def serialize_subservices(data)
                if data.is_a?(ActiveRecord::Relation)
                    data.map do |subservice|
                        SubserviceSerializer.new(subservice).serializable_hash[:data][:attributes]
                    end
                else
                    SubserviceSerializer.new(data).serializable_hash[:data][:attributes]
                end
            end

            def render_subservice_json(subservices, status)
                serialized_data = serialize_subservices(subservices)
                render json: { data: serialized_data }, status: status
            end

            def subservice_params
                params.require(:subservice).permit(:service_id, :service_title, :unit, :image_url, :title, :category, :price)
            end
        end
    end
end
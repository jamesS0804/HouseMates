module Api
    module V1
        class ServicesController < ApplicationController
            respond_to :json
            before_action :authenticate_user!
            before_action :get_specific_service, only: [:show, :update]

            def index
                services = Service.order(:id)
                serialized_data = serialize_services(services)
                render json: { data: serialized_data }, status: :ok
            end

            def create
                service = Service.new(service_params)
                if service.save
                    render_service_json(service, :created)
                else
                    render json: { errors: service.errors }, status: :unprocessable_entity
                end
            end
        
            def show
                render_service_json(@service, :ok)
            end

            def update
                if @service.update(service_params)
                    render_service_json(@service, :ok)
                else
                    render json: { errors: @service.errors }, status: :unprocessable_entity
                end
            end

            private
        
            def get_specific_service
                @service = Service.find(params[:id])
            end

            def serialize_services(data)
                if data.is_a?(ActiveRecord::Relation)
                    data.map do |service|
                        ServiceSerializer.new(service).serializable_hash[:data][:attributes]
                    end
                else
                    ServiceSerializer.new(data).serializable_hash[:data][:attributes]
                end
            end

            def render_service_json(service, status)
                serialized_data = serialize_services(service)
                render json: { data: serialized_data }, status: status
            end

            def service_params
                params.require(:service).permit(:title, :price)
            end
        end
    end
end


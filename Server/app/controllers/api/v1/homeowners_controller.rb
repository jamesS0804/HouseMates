module Api
    module V1
        class HomeownersController < ApplicationController
            before_action :authenticate_user!

            def create
                homeowner = Homeowner.new(homeowner_params)
                if homeowner.save
                  render_serialized_data(homeowner, :created)
                else
                  render json: { errors: homeowner.errors }, status: :unprocessable_entity
                end
            end

            def update
                homeowner = Homeowner.find(params[:id])

                if homeowner.update(homeowner_params)
                    render_serialized_data(homeowner, :ok)
                else
                  render json: { errors: homeowner.errors }, status: :unprocessable_entity
                end
            end

            private
        
            def render_serialized_data(data, status)
                render json: { data: HomeownerSerializer.new(data).serializable_hash[:data][:attributes] }, status: status
            end

            def homeowner_params
                params.require(:homeowner).permit(:id, :email, :password, :is_verified)
            end
        end
    end
end
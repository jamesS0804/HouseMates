module Api
    module V1
        class HomeownersController < ApplicationController
            def create
                homeowner = Homeowner.new(homeowner_params)
                if homeowner.save
                  render json: { data: HomeownerSerializer.new(homeowner).serializable_hash[:data][:attributes] , status: :created }
                else
                  render json: homeowner.errors, status: :unprocessable_entity
                end
            end

            private
        
            def homeowner_params
                params.require(:homeowner).permit(:name, :email, :password, :phone_number)
            end
        end
    end
end
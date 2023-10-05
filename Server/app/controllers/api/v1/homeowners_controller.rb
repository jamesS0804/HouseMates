module Api
    module V1
        class HomeownersController < ApplicationController
            def create
                homeowner = Homeowner.new(homeowner_params)
                if homeowner.save
                  render json: { data: homeowner, status: :created }
                else
                  render json: homeowner.errors, status: :unprocessable_entity
                end
            end

            private
        
            def homeowner_params
                params.require(:user).permit(:name, :email, :phone_number)
            end
        end
    end
end
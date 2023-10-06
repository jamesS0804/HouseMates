module Api
    module V1
        class HousematesController < ApplicationController
            def create
                housemate = Housemate.new(housemate_params)
                if housemate.save
                  render json: { data: housemate, status: :created }
                else
                  render json: housemate.errors, status: :unprocessable_entity
                end
            end

            private
        
            def housemate_params
                params.require(:user).permit(:email, :password)
            end
        end
    end
end
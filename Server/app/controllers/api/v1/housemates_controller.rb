module Api
    module V1
        class HousematesController < ApplicationController
            before_action :authenticate_user!
            
            def create
                housemate = Housemate.new(housemate_params)
                if housemate.save
                  render json: { data: HousemateSerializer.new(housemate).serializable_hash[:data][:attributes], status: :created }
                else
                  render json: housemate.errors, status: :unprocessable_entity
                end
            end

            def update
                housemate = Housemate.find(params[:id])

                if housemate.update(housemate_params)
                    render json: { data: HousemateSerializer.new(housemate).serializable_hash[:data][:attributes], status: :ok }
                  else
                    render json: { errors: housemate.errors }, status: :unprocessable_entity
                  end
            end

            private
        
            def housemate_params
                params.require(:housemate).permit(:id, :email, :password, :is_active, :is_verified)
            end
        end
    end
end
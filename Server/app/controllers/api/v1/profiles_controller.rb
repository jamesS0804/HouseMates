class Api::V1::ProfilesController < ApplicationController
    def create
        user = User.find(profile_params[:id])
        if user
            profile = user.build_profile(profile_params.merge(user_id: user.id))
            address = profile.build_address(profile_params[:address_attributes])
            if profile.save && address.save
                profile_data = ProfileSerializer.new(profile).serializable_hash[:data][:attributes]
                address_data = AddressSerializer.new(address).serializable_hash[:data][:attributes]

                combined_data = profile_data.merge(address: address_data)

                render json: { data: combined_data }, status: :created
            else
                render json: profile.errors, status: :unprocessable_entity
            end
        else
            render json: user.errors, status: :unprocessable_entity
        end
    end

    def show
        user = User.find(profile_params[:id])
        profile = user.profile
        serialized_data = ProfileSerializer.new(profile).serializable_hash[:data][:attributes]
        render json: { data: serialized_data, status: :ok }
    end

    private

    def profile_params
        params.require(:profile).permit(:id, :name, :phone_number, :email, address_attributes: [:address_line_1, :barangay, :city, :province, :zip_code])
    end
end

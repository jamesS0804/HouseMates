class Api::V1::ProfilesController < ApplicationController
    def create
        user = User.find(profile_params[:id])
        if user
            profile = user.build_profile(profile_params.merge(user_id: user.id))
            address = profile.build_address(profile_params[:address_attributes])
            if profile.save && address.save
                render_profile_json(profile, address, status)
            else
                render json: profile.errors, status: :unprocessable_entity
            end
        else
            render json: user.errors, status: :unprocessable_entity
        end
    end

    def show
        user = User.find(params[:id])
        profile = user.profile
        address = profile.address
        render_profile_json(profile, address, status)
    end

    private

    def serialize_data(profile, address)
        profile_data = ProfileSerializer.new(profile).serializable_hash[:data][:attributes]
        address_data = AddressSerializer.new(address).serializable_hash[:data][:attributes]
        profile_data.merge(address: address_data)
    end

    def render_profile_json(profile, address, status)
        serialized_data = serialize_data(profile, address)
        render json: { data: serialized_data, status: status }
    end

    def profile_params
        params.require(:profile).permit(:id, :name, :phone_number, :email, address_attributes: [:address_line_1, :barangay, :city, :province, :zip_code])
    end
end

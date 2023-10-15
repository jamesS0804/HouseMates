require 'rails_helper'

RSpec.describe Api::V1::ProfilesController, type: :controller do
  let(:user) { User.create(email: 'test@example.com', password: 'password', type: 'Homeowner', confirmed_at: Date.today) }

  before(:each) do
    sign_in(user)
  end

  describe 'POST #create' do
    it 'creates a new profile with an associated address' do
      profile_params = {
        id: user.id,
        name: 'John Doe',
        phone_number: '1234567890',
        email: 'john@example.com',
        address_attributes: {
          address_line_1: '123 Main St',
          barangay: 'Sample Barangay',
          city: 'Sample City',
          province: 'Sample Province',
          zip_code: '12345'
        }
      }

      post :create, params: { profile: profile_params, format: :json }

      expect(response).to have_http_status(:created)
      expect(Profile.count).to eq(1)
      expect(Address.count).to eq(1)
    end

    it 'returns an error response for invalid data' do
      post :create, params: { profile: { id: user.id }, format: :json }

      expect(response).to have_http_status(:unprocessable_entity)
    end
  end

  describe 'GET #show' do
    it 'returns the user profile and associated address' do
        profile = user.build_profile({ name: 'John Doe', phone_number: '1234567890', email: user.email, user_id: user.id })
        address = profile.build_address(
            address_line_1: '123 Main St',
            barangay: 'Sample Barangay',
            city: 'Sample City',
            province: 'Sample Province',
            zip_code: '12345'
        )
        profile.save
        address.save

        get :show, params: { id: user.id, format: :json }

        expect(response).to have_http_status(:ok)
        expect(JSON.parse(response.body)['data']['name']).to eq('John Doe')
        expect(JSON.parse(response.body)['data']['address']['address_line_1']).to eq('123 Main St')
    end
  end

  describe 'PUT #update' do
    before(:each) do
        profile = user.build_profile({ name: 'John Doe', phone_number: '1234567890', email: user.email, user_id: user.id })
        address = profile.build_address(
        address_line_1: '123 Main St',
        barangay: 'Sample Barangay',
        city: 'Sample City',
        province: 'Sample Province',
        zip_code: '12345'
        )
        profile.save
        address.save
    end
    it 'updates the user profile and associated address' do
      put :update, params: { id: user.id, profile: { name: 'Updated Name' }, format: :json }

      expect(response).to have_http_status(:ok)
      expect(user.reload.profile.name).to eq('Updated Name')
    end

    it 'returns an error response for invalid data' do
      put :update, params: { id: user.id, profile: { name: "" }, format: :json }

      expect(response).to have_http_status(:unprocessable_entity)
    end
  end
end

require 'rails_helper'

RSpec.describe Users::RegistrationsController, type: :controller do
  before do
    @request.env['devise.mapping'] = Devise.mappings[:user]
  end

  describe 'POST #create' do
    context 'with valid user data' do
      it 'creates a new user and returns JSON response' do
        user_params = {
          user: {
            email: 'test@example.com',
            password: 'password123',
            type: 'Homeowner'
          }
        }

        post :create, params: user_params, format: :json

        expect(response).to have_http_status(:ok)

        json_response = JSON.parse(response.body)
        expect(json_response['data']['email']).to eq(user_params[:user][:email])
      end
    end

    context 'with invalid user data' do
      it 'returns an error JSON response' do
        invalid_params = {
          user: {
            email: 'invalid-email',
            password: 'short'
          }
        }

        post :create, params: invalid_params, format: :json

        expect(response).to have_http_status(:unprocessable_entity)
      end
    end
  end
end

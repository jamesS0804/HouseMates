require 'rails_helper'

RSpec.describe 'Users::SessionsControllers', type: :request do
  let(:user) { User.create(email: 'johnDoe@example.com', password: 'password', type: 'Homeowner', confirmed_at: Date.today) }
  let(:headers) { { 'Authorization' => response.headers['Authorization'] } }

  before { post '/login', params: { user: { email: user.email, password: user.password } } }

  describe 'POST sign_in' do
    context 'when the user logged in and is authenticated' do
      it 'returns a JSON response with a success message' do
        expect(response).to have_http_status(:ok)

        json_response = JSON.parse(response.body)
        expect(json_response['data']['email']).to eq(user.email)

        json_headers = response.headers
        expect(json_headers['Authorization']).to_not be_empty
        expect(json_headers['expiry']).to_not be_nil
      end
    end
  end

  describe 'DELETE sign_out' do
    context 'when the user logs out successfully' do
      it 'returns a JSON response with a success message' do
        delete '/logout', headers: headers

        expect(response).to have_http_status(:ok)
      end
    end
  end
end
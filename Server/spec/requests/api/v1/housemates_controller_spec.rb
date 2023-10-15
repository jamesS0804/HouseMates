require 'rails_helper'

RSpec.describe Api::V1::HousematesController, type: :controller do
  let(:user) { User.create(email: 'test@example.com', password: 'password', type: 'Housemate', confirmed_at: Date.today()) }
  let(:housemate) { Housemate.create(email: 'housemate@example.com', password: 'password', is_active: true, is_verified: true) }

  before(:each) do
    sign_in(user)
    housemate
  end

  describe 'POST #create' do
    it 'creates a new housemate' do
      post :create, params: { housemate: { email: 'newhousemate@example.com', password: 'password', is_active: true, is_verified: true }, format: :json }
      expect(response).to have_http_status(:created)
      expect(Housemate.count).to eq(3)
    end

    it 'returns an error response for invalid data' do
      post :create, params: { housemate: { email: nil, password: 'password', is_active: true, is_verified: true }, format: :json }

      expect(response).to have_http_status(:unprocessable_entity)
    end
  end

  describe 'PUT #update' do
    it 'updates an existing housemate' do
      put :update, params: { id: housemate.id, housemate: { is_verified: false }, format: :json }

      expect(response).to have_http_status(:ok)
      expect(housemate.reload.is_verified).to eq(false)
    end

    it 'returns an error response for invalid data' do
      put :update, params: { id: housemate.id, housemate: { email: nil }, format: :json }

      expect(response).to have_http_status(:unprocessable_entity)
    end
  end
end

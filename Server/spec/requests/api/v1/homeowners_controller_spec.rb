require 'rails_helper'

RSpec.describe Api::V1::HomeownersController, type: :controller do
  let(:user) { User.create(email: 'test@example.com', password: 'password', type: 'Homeowner', confirmed_at: Date.today) }

  before(:each) do
    sign_in(user)
  end

  describe 'POST #create' do
    it 'creates a new homeowner' do
      post :create, params: { homeowner: { email: 'newhomeowner@example.com', password: 'password', is_verified: true }, format: :json }

      expect(response).to have_http_status(:created)
      expect(Homeowner.count).to eq(2) # Assuming you have a Homeowner model
    end

    it 'returns an error response for invalid data' do
      post :create, params: { homeowner: { email: nil, password: 'password', is_verified: true }, format: :json }

      expect(response).to have_http_status(:unprocessable_entity)
    end
  end

  describe 'PUT #update' do
    let(:homeowner) { Homeowner.create(email: 'homeowner@example.com', password: 'password123', is_verified: true, confirmed_at: Date.today) }
    it 'updates an existing homeowner' do
      put :update, params: { id: homeowner.id, homeowner: { is_verified: false }, format: :json }
      
      expect(response).to have_http_status(:ok)
      expect(homeowner.reload.is_verified).to eq(false)
    end

    it 'returns an error response for invalid data' do
      put :update, params: { id: homeowner.id, homeowner: { email: nil }, format: :json }

      expect(response).to have_http_status(:unprocessable_entity)
    end
  end
end

require 'rails_helper'

RSpec.describe Api::V1::ServicesController, type: :controller do
  let(:user) { User.create(email: 'test@example.com', password: 'password', type: 'Homeowner', confirmed_at: Date.today) }

  before(:each) do
    sign_in(user)
  end

  describe 'GET #index' do
    it 'returns a list of services' do
      service1 = Service.create(title: 'Service 1', price: 100)
      service2 = Service.create(title: 'Service 2', price: 200)

      get :index, format: :json

      expect(response).to have_http_status(:ok)
      expect(JSON.parse(response.body)['data'].count).to eq(2)
    end
  end

  describe 'POST #create' do
    it 'creates a new service' do
      post :create, params: { service: { title: 'New Service', price: 150 }, format: :json }

      expect(response).to have_http_status(:created)
      expect(Service.count).to eq(1)
    end

    it 'returns an error response for invalid data' do
      post :create, params: { service: { title: nil, price: 150 }, format: :json }

      expect(response).to have_http_status(:unprocessable_entity)
    end
  end

  describe 'GET #show' do
    it 'returns a specific service' do
      service = Service.create(title: 'Service 1', price: 100)

      get :show, params: { id: service.id, format: :json }

      expect(response).to have_http_status(:ok)
      expect(JSON.parse(response.body)['data']['title']).to eq('Service 1')
    end
  end

  describe 'PUT #update' do
    it 'updates an existing service' do
      service = Service.create(title: 'Service 1', price: 100)

      put :update, params: { id: service.id, service: { price: 150 }, format: :json }

      expect(response).to have_http_status(:ok)
      expect(service.reload.price).to eq(150)
    end

    it 'returns an error response for invalid data' do
      service = Service.create(title: 'Service 1', price: 100)

      put :update, params: { id: service.id, service: { title: nil }, format: :json }

      expect(response).to have_http_status(:unprocessable_entity)
    end
  end
end

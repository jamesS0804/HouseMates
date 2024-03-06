require 'rails_helper'

RSpec.describe Api::V1::HousemateServicesController, type: :controller do
  let(:user) { User.create(email: 'test@example.com', password: 'password', type: 'Homeowner', confirmed_at: Date.today) }
  let(:housemate) { Housemate.create(email: 'housemate@example.com', password: 'password') }
  let(:service1) { Service.create(title: 'Service 1', price: 500) }
  let(:service2) { Service.create(title: 'Service 2', price: 600) }

  before(:each) do
    sign_in(user)
  end

  describe 'POST #create' do
    it 'creates new housemate services' do
      housemate_services_params = {
        id: housemate.id,
        email: housemate.email,
        services: [
          { id: service1.id, title: service1.title },
          { id: service2.id, title: service2.title }
        ]
      }

      post :create, params: { housemate_service: housemate_services_params, format: :json }

      expect(response).to have_http_status(:created)
      expect(HousemateService.count).to eq(2)
    end

    it 'returns an error response for invalid data' do
      invalid_params = {
        id: housemate.id,
        email: nil,
        services: [ { id: nil, title: 'Invalid Service' } ]
      }

      post :create, params: { housemate_service: invalid_params, format: :json }

      expect(response).to have_http_status(:internal_server_error)
    end

    it 'returns an error response for invalid model data' do
      valid_params = {
        id: housemate.id,
        email: housemate.email,
        services: [ { id: service1.id, title: service1.title } ]
      }
      housemate.housemate_services.create({
        id: housemate.id,
        email: housemate.email,
        service_title: service1.title,
        service_id: service1.id
      })
      post :create, params: { housemate_service: valid_params, format: :json }

      expect(response).to have_http_status(:unprocessable_entity)
    end
  end
end
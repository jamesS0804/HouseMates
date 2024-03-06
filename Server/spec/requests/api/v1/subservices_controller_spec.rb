require 'rails_helper'

RSpec.describe Api::V1::SubservicesController, type: :controller do
  let(:user) { User.create(email: 'johnDoe1@example.com', password: 'password', type: 'Homeowner', confirmed_at: Date.today) }
  let(:service) { Service.create(title: "Cleaning Service", price: 399) }
  
  before(:each) do
    sign_in(user)
  end

  describe 'POST #create' do
    it 'creates a new subservice' do
      post :create, params: {
        subservice: {
          service_id: service.id,
          service_title: 'Cleaning Service',
          unit: 'Hour',
          image_url: 'example.com/image.jpg',
          title: 'House Cleaning',
          category: 'Cleaning',
          price: 50.0
        },
        format: :json
      }
      expect(response).to have_http_status(:created)
      expect(Subservice.count).to eq(1)
    end

    it 'returns an error response for invalid data' do
      post :create, params: { subservice: { service_id: service.id, title: "" }, format: :json }
      expect(response).to have_http_status(:unprocessable_entity)
    end
  end

  describe 'GET #show' do
    it 'returns a list of subservices for a given service' do
      subservice1 = service.subservices.create({
          service_id: service.id,
          service_title: 'Cleaning Service',
          unit: 'Hour',
          image_url: 'example.com/image.jpg',
          title: 'House Cleaning',
          category: 'Cleaning',
          price: 50.0
      })
      subservice2 = service.subservices.create({
          service_id: service.id,
          service_title: 'Cleaning Service',
          unit: 'Hour',
          image_url: 'example.com/image.jpg',
          title: 'House Cleaning 2',
          category: 'Cleaning',
          price: 150.0
      })
      get :show, params: { id: service.id, format: :json }

      expect(response).to have_http_status(:ok)
      expect(JSON.parse(response.body)['data'].count).to eq(2)
    end
  end

  describe 'PUT #update' do
    it 'updates an existing subservice' do
      subservice = Subservice.create({
        service_id: service.id,
        service_title: 'Cleaning Service',
        unit: 'Hour',
        image_url: 'example.com/image.jpg',
        title: 'House Cleaning',
        category: 'Cleaning',
        price: 50.0
      })

      patch :update, params: { id: subservice.id, subservice: { price: 60.0 }, format: :json }

      expect(response).to have_http_status(:ok)
      expect(subservice.reload.price).to eq(60.0)
    end

    it 'returns an error response for invalid data' do
      subservice = Subservice.create({
        service_id: service.id,
        service_title: 'Cleaning Service',
        unit: 'Hour',
        image_url: 'example.com/image.jpg',
        title: 'House Cleaning',
        category: 'Cleaning',
        price: 50.0
      })

      put :update, params: { id: subservice.id, subservice: { service_id: nil }, format: :json }

      expect(response).to have_http_status(:unprocessable_entity)
    end
  end
end

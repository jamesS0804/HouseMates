require 'rails_helper'

RSpec.describe Api::V1::BookingsController, type: :controller do
  let(:homeowner) { Homeowner.create(email: 'homeowner@example.com', password: 'password', confirmed_at: Date.today) }
  let(:homeowner_profile) { Profile.create(
    id: homeowner.id,
    name: 'John Doe',
    phone_number: '1234567890',
    email: homeowner.email,
    address_attributes: {
      address_line_1: '123 Main Street',
      barangay: 'Sample Barangay',
      city: 'Sample City',
      province: 'Sample Province',
      zip_code: '12345'
    }
  ) }
  let(:service) { Service.create(title: "Rspec Service", price: 399) }
  let(:subservice) { Subservice.create(
    service_id: service.id,
    service_title: service.title,
    unit: 'Hour',
    image_url: 'example.com/image.jpg',
    title: 'House Cleaning',
    category: 'Cleaning',
    price: 50.0
  ) }
  let(:valid_booking_params) do
    {
      scheduled_at: '2:00 PM October 14, 2023 Thursday',
      status: 'PENDING',
      total_cost: 100.0,
      payment_method: 'Credit Card',
      homeowner_id: homeowner.id,
      service: { id: service.id, title: service.title },
      service_details: [{ id: subservice.id, title: subservice.title, quantity: 2 }],
      address_attributes: {
        address_line_1: '123 Main Street',
        barangay: 'Sample Barangay',
        city: 'Sample City',
        province: 'Sample Province',
        zip_code: '12345'
      }
    }
  end
  let(:invalid_booking_params) do
    {
      scheduled_at: '2:00 PM October 14, 2023 Thursday',
      status: 'PENDING',
      total_cost: 100.0,
      payment_method: 'Credit Card',
      homeowner_id: homeowner.id,
      service: { id: service.id, title: service.title },
      service_details: [{ id: subservice.id, title: subservice.title, quantity: 2 }],
      address_attributes: {
        address_line_1: '123 Main Street',
        barangay: 'Sample Barangay',
        city: 'Sample City',
        province: 'Sample Province',
        zip_code: '12345'
      }
    }
  end

  before(:each) do
    sign_in(homeowner)
  end

  describe 'POST #create' do
    it 'creates a new booking' do
      post :create, params: { booking: valid_booking_params, format: :json }

      expect(response).to have_http_status(:ok)
    end

    xit 'returns an error response for invalid data' do
      post :create, params: { booking: invalid_booking_params, format: :json }

      expect(response).to have_http_status(:unprocessable_entity)
    end
  end

  describe 'GET #show' do
    it 'returns a list of bookings for a user' do
      get :show, params: { id: homeowner.id, format: :json }

      expect(response).to have_http_status(:ok)
    end
  end

  describe 'PUY #update' do
    before(:each) do
      post :create, params: { booking: valid_booking_params, format: :json }
      @booking = Booking.find(2)
    end
    it 'returns a successful response' do
      patch :update, params: {
        id: @booking.id,
        booking: {
          status: 'ACCEPTED',
          homeowner_id: @booking.homeowner[:id],
          housemate_id: @booking.housemate[:id]
        }
      }

      expect(response).to have_http_status(:ok)
    end

    it 'updates the booking' do
      updated_status = 'ACCEPTED'

      patch :update, params: {
        id: booking.id,
        booking: {
          status: updated_status,
          homeowner_id: booking.homeowner.id,
          housemate_id: booking.housemate.id
        }
      }

      booking.reload
      expect(booking.status).to eq(updated_status)
    end

    it 'handles errors and returns an error response if update fails' do
      patch :update, params: {
        id: booking.id,
        booking: {
          status: 'INVALID_STATUS',
          homeowner_id: booking.homeowner.id,
          housemate_id: booking.housemate.id
        }
      }
      expect(response).to have_http_status(:unprocessable_entity) 
      expect(JSON.parse(response.body)).to have_key('error')
    end
  end
end
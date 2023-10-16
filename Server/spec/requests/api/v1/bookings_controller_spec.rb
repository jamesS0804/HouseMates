require 'rails_helper'

RSpec.describe Api::V1::BookingsController, type: :controller do
  let(:homeowner) { Homeowner.create(email: 'homeowner@example.com', password: 'password', confirmed_at: Date.today) }
  let(:housemate) { Housemate.create(email: 'housemate@example.com', password: 'password', confirmed_at: Date.today) }
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
  let(:housemate_booking_params) do
    {
      scheduled_at: '2:00 PM October 14, 2023 Thursday',
      status: 'PENDING',
      total_cost: 100.0,
      payment_method: 'Credit Card',
      homeowner_id: homeowner.id,
      housemate_id: housemate.id,
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
        zip_code: ''
      }
    }
  end

  before(:each) do
    sign_in(homeowner)
    @homeowner_profile = Profile.create(
      user: homeowner,
      name: 'John Doe',
      phone_number: '1234567890',
      email: homeowner[:email],
      address_attributes: {
        address_line_1: '123 Main Street',
        barangay: 'Sample Barangay',
        city: 'Sample City',
        province: 'Sample Province',
        zip_code: '12345'
      }
    )
    @housemate_profile = Profile.create(
      user: housemate,
      name: 'Jane Doe',
      phone_number: '1234567891',
      email: housemate[:email],
      address_attributes: {
        address_line_1: '123 Main Street',
        barangay: 'Sample Barangay',
        city: 'Sample City',
        province: 'Sample Province',
        zip_code: '12345'
      }
    )
    @housemate_house_service = HousemateService.create(
      housemate_id: housemate.id, 
      email: housemate.email, 
      service_title: service.title, 
      service_id: service.id
    )
  end

  describe 'POST #create' do
    context 'when a homeowner successfully books a job' do
      context 'but no nearby housemate was found' do
        it "returns an error response" do
          post :create, params: { booking: valid_booking_params, format: :json }

          expect(response).to have_http_status(:ok)
          expect(homeowner.profile.balance).to eq(9900)

          jsonResponse = JSON.parse(response.body)
          expect(jsonResponse['error']).to eq('No nearby available housemate found.')
        end
      end
      context 'and a housemate is found' do
        it "returns a successful response when a nearby housemate is found" do
          housemate.update(is_active: true)
          post :create, params: { booking: valid_booking_params, format: :json }

          expect(response).to have_http_status(:ok)

          jsonResponse = JSON.parse(response.body)
          expect(jsonResponse['data']['status']).to eq('PENDING')
          expect(jsonResponse['data']['housemate']['id']).to eq(housemate[:id])
          expect(jsonResponse['data']['housemate']['name']).to eq(housemate.profile.name)
        end
      end
    end
    context 'when a homeowner attempts to book a job but provides invalid data' do
      it 'returns an error response' do
        post :create, params: { booking: invalid_booking_params, format: :json }

        expect(response).to have_http_status(:unprocessable_entity)
        
        jsonResponse = JSON.parse(response.body)
        expect(jsonResponse).to have_key('error')
      end
    end
  end

  describe 'GET #show' do
    context 'when a homeowner or a housemate wants to see his/her list of bookings' do
      it 'returns a list of bookings for a user' do
        post :create, params: { booking: valid_booking_params, format: :json }
        get :show, params: { id: homeowner.id, format: :json }

        expect(response).to have_http_status(:ok)

        jsonResponse = JSON.parse(response.body)
        expect(jsonResponse['data'].length).to eq(1)
        expect(jsonResponse['data'][0]['homeowner']['id']).to eq(homeowner[:id])
      end
    end
  end

  describe 'PUT #update' do
    before(:each) do
      post :create, params: { booking: valid_booking_params, format: :json }
      @booking = Booking.last
    end
    context 'when a housemate was assigned a job' do
      context 'and he/she accepts it' do
        it 'returns a success response' do
          patch :update, params: {
            id: @booking.id,
            booking: {
              status: 'ACCEPTED',
              homeowner_id: @booking.homeowner[:id],
              housemate_id: housemate[:id]
            }
          }
          expect(response).to have_http_status(:ok)
          jsonResponse = JSON.parse(response.body)

          expect(jsonResponse['data']['status']).to eq('IN PROGRESS')
          expect(jsonResponse['data']['housemate']['id']).to eq(housemate[:id])
          expect(jsonResponse['data']['housemate']['name']).to eq(housemate.profile.name)
        end
      end
      context 'but he/she rejects it' do
        it "returns an error response" do
          housemate.update(is_active: true)
          patch :update, params: {
            id: @booking.id,
            booking: {
              status: 'REJECTED',
              homeowner_id: @booking.homeowner[:id],
              housemate_id: housemate[:id]
            }
          }
          expect(response).to have_http_status(:ok)

          jsonResponse = JSON.parse(response.body)
          expect(jsonResponse['error']).to eq('No nearby available housemate found.')
        end
      end
      context 'and he/she accepted it and the homeowner completed the job' do
        it 'returns a successful response when COMPLETED' do
          @booking.update(housemate_id: housemate[:id])
          
          housemate_profile = Profile.create(
            user: housemate,
            name: 'Jane Doe',
            phone_number: '1234567891',
            email: housemate[:email],
            address_attributes: {
              address_line_1: '123 Main Street',
              barangay: 'Sample Barangay',
              city: 'Sample City',
              province: 'Sample Province',
              zip_code: '12345'
            }
          )
          patch :update, params: {
            id: @booking.id,
            booking: {
              status: 'COMPLETED',
              homeowner_id: @booking.homeowner[:id],
              housemate_id: @booking.housemate[:id]
            }
          }
          expect(response).to have_http_status(:ok)
          jsonResponse = JSON.parse(response.body)

          expect(jsonResponse['data']['status']).to eq('COMPLETED')
          expect(jsonResponse['data']['housemate']['id']).to eq(housemate[:id])
          expect(jsonResponse['data']['housemate']['name']).to eq(housemate.profile.name)
        end
      end
      context 'when a user wants to update the status of the booking but provided an invalid status input' do
        it 'returns an error response' do
          patch :update, params: {
            id: @booking.id,
            booking: {
              status: 'INVALID_STATUS',
              homeowner_id: @booking.homeowner.id,
              housemate_id: housemate[:id]
            }
          }
          expect(response).to have_http_status(:unprocessable_entity) 

          jsonResponse = JSON.parse(response.body)
          expect(jsonResponse).to have_key('error')
          expect(jsonResponse['error']).to eq('Invalid status input.')
        end
      end
    end
  end
end
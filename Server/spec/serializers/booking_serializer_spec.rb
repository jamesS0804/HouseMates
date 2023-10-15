require 'rails_helper'

RSpec.describe BookingSerializer do
  let(:homeowner) { User.create(email: 'homeowner@example.com', password: 'password', type: 'Homeowner') }
  let(:housemate) { User.create(email: 'housemate@example.com', password: 'password', type: 'Housemate') }
  let(:service) { Service.create(title: 'Cleaning Service') }
  let(:booking) do
    Booking.new(
      id: 1,
      status: 'PENDING',
      homeowner: homeowner,
      housemate: housemate,
      service_id: service.id,
      service_title: service.title,
      scheduled_at: Time.now,
      payment_method: 'credit_card',
      total_cost: 100.00,
      created_at: Time.now,
      updated_at: Time.now
    )
  end

  it 'serializes the booking data correctly' do
    homeowner_profile = Profile.create(
      name: 'John Doe',
      phone_number: '1234567890',
      email: 'homeowner@example.com',
      user: homeowner
    )
    housemate_profile = Profile.create(
      name: 'Jane Doe',
      phone_number: '1234567891',
      email: 'housemate@example.com',
      user: housemate
    ) 
    serialized_booking = BookingSerializer.new(booking).serializable_hash
    expect(serialized_booking[:data][:attributes]).to include(
      id: 1,
      status: 'PENDING',
      scheduled_at: booking.scheduled_at,
      payment_method: 'credit_card',
      total_cost: 100.00,
    )
    
    expect(serialized_booking[:data][:attributes][:homeowner]).to include(
      id: homeowner.id,
      name: homeowner.profile.name
    )

    expect(serialized_booking[:data][:attributes][:housemate]).to include(
      id: housemate.id,
      name: housemate.profile.name
    )

    expect(serialized_booking[:data][:attributes][:service]).to include(
      id: service.id,
      title: service.title
    )
  end
end

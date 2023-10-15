require 'rails_helper'

RSpec.describe BookingServiceSerializer do
  let(:booking_service) do
    BookingService.new(
      booking_id: 1,
      service_id: 2,
      subservice_id: 3,
      title: 'Cleaning Service',
      quantity: 2,
      price_per_quantity: 25.0,
      total: 50.0,
      created_at: Time.now,
      updated_at: Time.now
    )
  end

  subject { described_class.new(booking_service).serializable_hash }

  it 'serializes the BookingService attributes' do
    expect(subject[:data][:attributes][:booking_id]).to eq(booking_service.booking_id)
    expect(subject[:data][:attributes][:service_id]).to eq(booking_service.service_id)
    expect(subject[:data][:attributes][:subservice_id]).to eq(booking_service.subservice_id)
    expect(subject[:data][:attributes][:title]).to eq(booking_service.title)
    expect(subject[:data][:attributes][:quantity]).to eq(booking_service.quantity)
    expect(subject[:data][:attributes][:price_per_quantity]).to eq(booking_service.price_per_quantity)
    expect(subject[:data][:attributes][:total]).to eq(booking_service.total)
    expect(subject[:data][:attributes][:created_at]).to eq(booking_service.created_at)
    expect(subject[:data][:attributes][:updated_at]).to eq(booking_service.updated_at)
  end
end
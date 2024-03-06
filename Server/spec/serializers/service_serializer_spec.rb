require 'rails_helper'

RSpec.describe ServiceSerializer do
  let(:service) do
    Service.new(
      id: 1,
      title: 'Sample Service',
      price: 399.0,
      created_at: Time.now,
      updated_at: Time.now
    )
  end

  subject { described_class.new(service).serializable_hash }

  it 'serializes the service attributes' do
    expect(subject[:data][:id]).to eq(service.id.to_s)
    expect(subject[:data][:attributes][:title]).to eq(service.title)
    expect(subject[:data][:attributes][:price]).to eq(service.price)
    expect(subject[:data][:attributes][:created_at]).to eq(service.created_at)
    expect(subject[:data][:attributes][:updated_at]).to eq(service.updated_at)
  end
end

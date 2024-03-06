require 'rails_helper'

RSpec.describe SubserviceSerializer do
  let(:subservice) do
    Subservice.new(
      id: 1,
      title: 'Sample Subservice',
      category: 'Sample Category',
      price: 50.0,
      image_url: 'sample.jpg',
      unit: 'Hour',
      service_id: 1,
      service_title: 'Sample Service',
      created_at: Time.now,
      updated_at: Time.now
    )
  end

  subject { described_class.new(subservice).serializable_hash }

  it 'serializes the subservice attributes' do
    expect(subject[:data][:id]).to eq(subservice.id.to_s)
    expect(subject[:data][:attributes][:title]).to eq(subservice.title)
    expect(subject[:data][:attributes][:category]).to eq(subservice.category)
    expect(subject[:data][:attributes][:price]).to eq(subservice.price)
    expect(subject[:data][:attributes][:image_url]).to eq(subservice.image_url)
    expect(subject[:data][:attributes][:unit]).to eq(subservice.unit)
    expect(subject[:data][:attributes][:service_id]).to eq(subservice.service_id)
    expect(subject[:data][:attributes][:service_title]).to eq(subservice.service_title)
    expect(subject[:data][:attributes][:created_at]).to eq(subservice.created_at)
    expect(subject[:data][:attributes][:updated_at]).to eq(subservice.updated_at)
  end
end

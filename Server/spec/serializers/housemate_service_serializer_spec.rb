require 'rails_helper'

RSpec.describe HousemateServiceSerializer do
  let(:housemate_service) do
    HousemateService.new(
      id: 1,
      housemate_id: 2,
      email: 'john@example.com',
      service_id: 3,
      service_title: 'Cleaning Service'
    )
  end

  subject { described_class.new(housemate_service).serializable_hash }

  it 'serializes the housemate service attributes' do
    expect(subject[:data][:id]).to eq(housemate_service.id.to_s)
    expect(subject[:data][:attributes][:housemate_id]).to eq(housemate_service.housemate_id)
    expect(subject[:data][:attributes][:email]).to eq(housemate_service.email)
    expect(subject[:data][:attributes][:service_id]).to eq(housemate_service.service_id)
    expect(subject[:data][:attributes][:service_title]).to eq(housemate_service.service_title)
  end
end
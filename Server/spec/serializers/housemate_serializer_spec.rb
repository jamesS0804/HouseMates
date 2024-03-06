require 'rails_helper'

RSpec.describe HousemateSerializer do
  let(:housemate) do
    Housemate.new(
      id: 1,
      email: 'john@example.com',
      is_verified: true,
      is_active: true,
      created_at: Time.now,
      updated_at: Time.now
    )
  end

  subject { described_class.new(housemate).serializable_hash }

  it 'serializes the housemate attributes' do
    expect(subject[:data][:id]).to eq(housemate.id.to_s)
    expect(subject[:data][:attributes][:email]).to eq(housemate.email)
    expect(subject[:data][:attributes][:is_verified]).to eq(housemate.is_verified)
    expect(subject[:data][:attributes][:is_active]).to eq(housemate.is_active)
    expect(subject[:data][:attributes][:created_at]).to eq(housemate.created_at)
    expect(subject[:data][:attributes][:updated_at]).to eq(housemate.updated_at)
  end
end
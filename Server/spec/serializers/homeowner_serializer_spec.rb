require 'rails_helper'

RSpec.describe HomeownerSerializer do
  let(:homeowner) do
    Homeowner.new(
      id: 1,
      email: 'alice@example.com',
      is_verified: true,
      created_at: Time.now,
      updated_at: Time.now
    )
  end

  subject { described_class.new(homeowner).serializable_hash }

  it 'serializes the homeowner attributes' do
    expect(subject[:data][:id]).to eq(homeowner.id.to_s)
    expect(subject[:data][:attributes][:email]).to eq(homeowner.email)
    expect(subject[:data][:attributes][:is_verified]).to eq(homeowner.is_verified)
    expect(subject[:data][:attributes][:created_at]).to eq(homeowner.created_at)
    expect(subject[:data][:attributes][:updated_at]).to eq(homeowner.updated_at)
  end
end
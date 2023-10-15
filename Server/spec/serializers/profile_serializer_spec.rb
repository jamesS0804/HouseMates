require 'rails_helper'

RSpec.describe ProfileSerializer do
  let(:profile) do
    Profile.new(
      id: 1,
      name: 'John Doe',
      phone_number: '123-456-7890',
      email: 'john.doe@example.com',
      balance: 500.0
    )
  end

  subject { described_class.new(profile).serializable_hash }

  it 'serializes the profile attributes' do
    expect(subject[:data][:id]).to eq(profile.id.to_s)
    expect(subject[:data][:attributes][:name]).to eq(profile.name)
    expect(subject[:data][:attributes][:phone_number]).to eq(profile.phone_number)
    expect(subject[:data][:attributes][:email]).to eq(profile.email)
    expect(subject[:data][:attributes][:balance]).to eq(profile.balance)
  end
end
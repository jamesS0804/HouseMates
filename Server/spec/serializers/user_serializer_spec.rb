require 'rails_helper'

RSpec.describe UserSerializer do
  let(:user) { User.create(email: 'john@example.com', password: 'password', type: 'Homeowner') } # Assuming you have FactoryBot and a User factory

  it 'serializes the user object correctly' do
    serializer = UserSerializer.new(user)
    serialized_user = serializer.serializable_hash

    expect(serialized_user).to have_key(:data)
    expect(serialized_user[:data]).to have_key(:id)
    expect(serialized_user[:data][:id]).to eq(user.id.to_s)
    expect(serialized_user[:data]).to have_key(:attributes)
    expect(serialized_user[:data][:attributes]).to include(
      email: user.email,
      is_verified: user.is_verified,
      type: user.type
    )
  end
end

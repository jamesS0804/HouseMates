require 'rails_helper'

RSpec.describe AddressSerializer do
  let(:address_data) do
    {
      address_line_1: '123 Main Street',
      barangay: 'Sample Barangay',
      city: 'Sample City',
      province: 'Sample Province',
      zip_code: '12345'
    }
  end

  it 'serializes the address data correctly' do
    serializer = AddressSerializer.new(Address.new(address_data))
    serialized_data = serializer.serializable_hash

    expect(serialized_data[:data][:attributes]).to include(
      address_line_1: address_data[:address_line_1],
      barangay: address_data[:barangay],
      city: address_data[:city],
      province: address_data[:province],
      zip_code: address_data[:zip_code]
    )
  end
end

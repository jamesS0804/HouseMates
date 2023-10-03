class AddressSerializer
  include JSONAPI::Serializer
  attributes :address_line_1, :barangay, :city, :city, :province, :zip_code
end

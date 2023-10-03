class ProfileSerializer
  include JSONAPI::Serializer
  attributes :name, :phone_number, :email
end

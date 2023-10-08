class ProfileSerializer
  include JSONAPI::Serializer
  attributes :id, :name, :phone_number, :email
end

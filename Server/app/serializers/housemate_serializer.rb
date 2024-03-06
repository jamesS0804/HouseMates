class HousemateSerializer
  include JSONAPI::Serializer
  attributes :id, :email, :is_verified, :is_active, :created_at, :updated_at
end

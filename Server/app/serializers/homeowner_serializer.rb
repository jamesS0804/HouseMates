class HomeownerSerializer
  include JSONAPI::Serializer
  attributes :id, :email, :is_verified, :created_at, :updated_at
end

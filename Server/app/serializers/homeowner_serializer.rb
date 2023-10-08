class HomeownerSerializer
  include JSONAPI::Serializer
  attributes :id, :email, :isVerified, :created_at, :updated_at
end

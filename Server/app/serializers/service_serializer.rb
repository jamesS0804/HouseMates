class ServiceSerializer
  include JSONAPI::Serializer
  attributes :id, :title, :price, :created_at, :updated_at
end

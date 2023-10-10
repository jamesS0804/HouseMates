class SubserviceSerializer
  include JSONAPI::Serializer
  attributes :id, :title, :category, :price, :service_id, :service_title, :created_at, :updated_at
end

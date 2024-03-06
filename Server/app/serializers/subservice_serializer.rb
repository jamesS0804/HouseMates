class SubserviceSerializer
  include JSONAPI::Serializer
  attributes :id, :title, :category, :price, :image_url, :unit, :service_id, :service_title, :created_at, :updated_at
end

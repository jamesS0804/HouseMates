class HousemateServiceSerializer
  include JSONAPI::Serializer
  attributes :id, :housemate_id, :email, :service_id, :service_title, :created_at, :updated_at
end

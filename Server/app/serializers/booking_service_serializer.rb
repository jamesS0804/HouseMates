class BookingServiceSerializer
  include JSONAPI::Serializer
  attributes :booking_id, :service_id, :subservice_id, :title, :quantity, :price_per_quantity, :total, :created_at, :updated_at
end

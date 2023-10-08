class BookingSerializer
  include JSONAPI::Serializer
  attributes :id, :status, :homeowner_id, :homeowner_name, :housemate_id, :scheduled_at, :payment_method, :total_cost, :created_at, :updated_at

  belongs_to :homeowner, serializer: HomeownerSerializer

  attribute :homeowner_name do |booking|
    booking.homeowner.profile.name
  end
end

class BookingSerializer
  include JSONAPI::Serializer
  attributes :id, :status , :homeowner, :housemate, :service, :scheduled_at, :payment_method, :total_cost, :created_at, :updated_at

  attribute :homeowner do |booking|
    {
      id: booking.homeowner.id,
      name: booking.homeowner.profile.name
    }
  end

  attribute :housemate do |booking|
    {
      id: booking.housemate&.id || "",
      name: booking.housemate&.profile&.name || ""
    }
  end

  attribute :service do |booking|
    {
      id: booking.service_id,
      title: booking.service_title
    }
  end
end

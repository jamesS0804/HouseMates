class BookingSerializer
  include JSONAPI::Serializer
  attributes :id, :status , :homeowner, :housemate, :service, :scheduled_at, :payment_method, :total_cost, :created_at, :updated_at

  attribute :homeowner do |booking|
    {
      id: booking.homeowner.id,
      name: booking.homeowner&.profile&.name || ""
    }
  end

  attribute :housemate do |booking|
    if booking.housemate_id
      housemate = Housemate.find(booking.housemate_id)
      {
        id: booking.housemate_id,
        name: housemate.profile[:name]
      }
    else
      {
        id: booking.housemate&.id || "",
        name: booking&.housemate&.profile&.name || ""
      }
    end
  end

  attribute :service do |booking|
    service = Service.find(booking.service_id)
    {
      id: service.id,
      title: service.title,
      price: service.price
    }
  end
end

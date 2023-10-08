class Housemate < User
    has_many :housemate_services, dependent: :destroy
    has_many :bookings, inverse_of: :housemate
end

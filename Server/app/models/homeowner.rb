class Homeowner < User
    has_many :bookings, inverse_of: :homeowner, foreign_key: 'homeowner_id'
end
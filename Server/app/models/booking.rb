class Booking < ApplicationRecord
    belongs_to :homeowner, class_name: 'Homeowner', foreign_key: 'homeowner_id', inverse_of: :bookings
    belongs_to :housemate, class_name: 'Housemate', foreign_key: 'housemate_id', optional: true
    has_one :address, dependent: :destroy
    has_many :booking_services, dependent: :destroy

    enum status: { 'PENDING' => 0, 'IN_PROGRESS' => 1, 'COMPLETED' => 2, 'CANCELLED' => 3 }
    accepts_nested_attributes_for :address

    validates :scheduled_at, presence: true
end

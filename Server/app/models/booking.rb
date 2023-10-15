class Booking < ApplicationRecord
    belongs_to :homeowner, class_name: 'Homeowner', foreign_key: 'homeowner_id', inverse_of: :bookings
    belongs_to :housemate, class_name: 'Housemate', foreign_key: 'housemate_id', optional: true, inverse_of: :bookings
    has_one :address, dependent: :destroy
    has_many :booking_services, dependent: :destroy

    enum status: { 'PENDING' => 0, 'ACCEPTED' => 1, 'REJECTED' => 2, 'IN_PROGRESS' => 3, 'COMPLETED' => 4, 'CANCELLED' => 5 }
    accepts_nested_attributes_for :address

    validates :status, inclusion: { in: statuses.keys }
    validates :scheduled_at, presence: { message: "Scheduled at cannot be blank." }
    validates :total_cost, presence: { message: "Total cost cannot be blank." }
    validates :payment_method, presence: { message: "Payment method cannot be blank." }
    validates :service_title, presence: { message: "Service Title cannot be blank." }
end

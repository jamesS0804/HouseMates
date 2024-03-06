class BookingService < ApplicationRecord
    belongs_to :booking, optional: true
  
    validates :quantity, presence: { message: "Quantity cannot be blank." },
                            numericality: { message: "Quantity must be a number" }
    validates :price_per_quantity, presence: { message: "Price per quantity cannot be blank." },
                            numericality: { message: "Proce per quantity must be a number" }
    validates :total, presence: { message: "Total cannot be be blank." },
                            numericality: { message: "Total must be a number" }
    validates :service_id, presence: { message: "Service ID cannot be blank." }
    validates :subservice_id, presence: { message: "Subservice ID cannot be blank." }
    validates :title, presence: { message: "Title cannot be blank." }
end
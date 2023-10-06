class Subservice < ApplicationRecord
    belongs_to :service

    validates :service_title, presence: { message: "Service title cannot be blank." }
    validates :title, presence: { message: "Title cannot be blank." },
                      uniqueness: { message: "Title has been taken." }
    validates :price, presence: { message: "Price cannot be blank." },
                      numericality: { message: "Price must be a number." }
end
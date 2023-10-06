class Service < ApplicationRecord
    has_many :subservices, dependent: :destroy

    validates :title, presence: { message: "Title cannot be blank." },
                      uniqueness: { message: "Title has been taken." }
    validates :price, presence: { message: "Price cannot be blank." },
                      numericality: { message: "Price must be a number." }
end
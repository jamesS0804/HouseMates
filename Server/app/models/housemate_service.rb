class HousemateService < ApplicationRecord
    belongs_to :housemate
    has_one :service

    validates :email, presence: { message: "Email cannot be blank." }
    validates :service_title, presence: { message: "Service title cannot be blank." },
                            uniqueness: { scope: :housemate_id }
end
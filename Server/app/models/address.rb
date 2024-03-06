class Address < ApplicationRecord
    belongs_to :profile, optional: true
    belongs_to :booking, optional: true

    validates :address_line_1, presence: { message: "Address Line 1 cannot be blank." }
    validates :barangay, presence: { message: "Barangay cannot be blank." }
    validates :city, presence: { message: "City cannot be blank." }
    validates :province, presence: { message: "Province cannot be blank." }
    validates :zip_code, presence: { message: "Zip code cannot be blank." }
end
class Profile < ApplicationRecord
    belongs_to :user

    has_one :address, dependent: :destroy
    accepts_nested_attributes_for :address

    after_create :set_initial_balance

    validates :name, presence: { message: "Name cannot be blank." }
    validates :phone_number, presence: { message: "Phone number cannot be blank." },
                                uniqueness: { message: "Phone number already taken." }
    validates :email, presence: { message: "Email cannot be blank." }

    private

    def set_initial_balance
        update(balance: 10000)
    end
end

class Profile < ApplicationRecord
    belongs_to :user

    has_one :address, dependent: :destroy
    accepts_nested_attributes_for :address

    after_create :set_initial_balance

    private

    def set_initial_balance
        update(balance: 10000)
    end
end

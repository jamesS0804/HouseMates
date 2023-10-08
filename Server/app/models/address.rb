class Address < ApplicationRecord
    belongs_to :profile, optional: true
    belongs_to :booking, optional: true
end
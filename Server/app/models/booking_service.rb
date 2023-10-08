class BookingService < ApplicationRecord
    belongs_to :booking, optional: true
end

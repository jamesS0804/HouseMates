class AddBookingReferencesToMultipleTables < ActiveRecord::Migration[7.0]
  def change
    add_reference :bookings, :homeowner, null:false, foreign_key: true
    add_reference :bookings, :housemate, null:false, foreign_key: true
    add_reference :bookings, :subservice, null:false, foreign_key: true
    add_reference :bookings, :address, null:false, foreign_key: true
  end
end
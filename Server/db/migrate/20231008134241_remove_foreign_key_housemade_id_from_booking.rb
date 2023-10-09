class RemoveForeignKeyHousemadeIdFromBooking < ActiveRecord::Migration[7.0]
  def change
    remove_foreign_key :bookings, column: :housemate_id
  end
end

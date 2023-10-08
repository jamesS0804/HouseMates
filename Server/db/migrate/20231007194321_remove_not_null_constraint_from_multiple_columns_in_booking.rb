class RemoveNotNullConstraintFromMultipleColumnsInBooking < ActiveRecord::Migration[7.0]
  def change
    change_column :bookings, :housemate_id, :bigint, null: true
    remove_reference :bookings, :subservice
  end
end

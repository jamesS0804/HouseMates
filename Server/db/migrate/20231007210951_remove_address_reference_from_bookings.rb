class RemoveAddressReferenceFromBookings < ActiveRecord::Migration[7.0]
  def change
    remove_reference :bookings, :address
    add_reference :addresses, :booking, null: true, foreign_key: true
  end
end

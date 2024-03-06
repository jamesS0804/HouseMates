class Correct2 < ActiveRecord::Migration[7.0]
  def change
    add_reference :bookings, :homeowner, null: false, foreign_key: true
  end
end

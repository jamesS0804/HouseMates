class UpdateTotalCostColumInBooking < ActiveRecord::Migration[7.0]
  def change
    change_column :bookings, :total_cost, :decimal, precision: 10, scale: 2, null: false
  end
end

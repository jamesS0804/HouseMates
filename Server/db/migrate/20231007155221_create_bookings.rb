class CreateBookings < ActiveRecord::Migration[7.0]
  def change
    create_table :bookings do |t|
      t.datetime :scheduled_at, null: false
      t.integer :status, default: 0, null: false
      t.decimal :total_cost, null: false
      t.timestamps
    end
  end
end

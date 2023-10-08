class CreateBookingServices < ActiveRecord::Migration[7.0]
  def change
    create_table :booking_services do |t|
      t.integer :quantity, default: 1, null: false
      t.decimal :price_per_quantity, precision: 10, scale: 2, null: false
      t.decimal :total, precision: 10, scale: 2, null: false
      t.timestamps
    end
  end
end

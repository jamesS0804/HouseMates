class AddPaymentMethodColumnToBooking < ActiveRecord::Migration[7.0]
  def change
    add_column :bookings, :payment_method, :string, null: false
  end
end

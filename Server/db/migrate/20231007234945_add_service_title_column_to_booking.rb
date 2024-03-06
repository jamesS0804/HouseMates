class AddServiceTitleColumnToBooking < ActiveRecord::Migration[7.0]
  def change
    add_column :bookings, :service_title, :string, null: false
  end
end

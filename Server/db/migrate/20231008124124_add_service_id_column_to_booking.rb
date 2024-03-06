class AddServiceIdColumnToBooking < ActiveRecord::Migration[7.0]
  def change
    add_column :bookings, :service_id, :integer
  end
end

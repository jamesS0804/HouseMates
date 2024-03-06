class AddTitleColumnToBookingService < ActiveRecord::Migration[7.0]
  def change
    add_column :booking_services, :title, :string, null: false
  end
end

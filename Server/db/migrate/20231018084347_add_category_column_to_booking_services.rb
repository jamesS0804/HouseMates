class AddCategoryColumnToBookingServices < ActiveRecord::Migration[7.1]
  def change
    add_column :booking_services, :category, :string
  end
end

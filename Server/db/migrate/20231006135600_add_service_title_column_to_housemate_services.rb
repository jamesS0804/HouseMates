class AddServiceTitleColumnToHousemateServices < ActiveRecord::Migration[7.0]
  def change
    add_column :housemate_services, :service_title, :string, null: false
  end
end

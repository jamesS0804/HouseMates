class AddIsActiveColumnToHousemate < ActiveRecord::Migration[7.0]
  def change
    add_column :housemates, :is_active, :boolean, default: false
  end
end

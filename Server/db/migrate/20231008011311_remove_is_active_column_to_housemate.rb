class RemoveIsActiveColumnToHousemate < ActiveRecord::Migration[7.0]
  def change
    remove_column :housemates, :is_active
  end
end

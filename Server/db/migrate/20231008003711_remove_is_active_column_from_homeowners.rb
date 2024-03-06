class RemoveIsActiveColumnFromHomeowners < ActiveRecord::Migration[7.0]
  def change
    remove_column :homeowners, :is_active
  end
end

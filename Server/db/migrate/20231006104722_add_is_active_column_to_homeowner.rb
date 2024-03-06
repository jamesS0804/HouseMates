class AddIsActiveColumnToHomeowner < ActiveRecord::Migration[7.0]
  def change
    add_column :homeowners, :is_active, :boolean, default: false
  end
end

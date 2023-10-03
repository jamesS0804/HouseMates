class AddTypeColumnToUser < ActiveRecord::Migration[7.0]
  def change
    add_column :users, :type, :string, null: false
  end
end

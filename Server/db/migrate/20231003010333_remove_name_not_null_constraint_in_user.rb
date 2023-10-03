class RemoveNameNotNullConstraintInUser < ActiveRecord::Migration[7.0]
  def change
    change_column :users, :name, :string, null: true
  end
end

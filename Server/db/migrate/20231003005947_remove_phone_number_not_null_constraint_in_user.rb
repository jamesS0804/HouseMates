class RemovePhoneNumberNotNullConstraintInUser < ActiveRecord::Migration[7.0]
  def change
    change_column :users, :phone_number, :string, null: true
  end
end

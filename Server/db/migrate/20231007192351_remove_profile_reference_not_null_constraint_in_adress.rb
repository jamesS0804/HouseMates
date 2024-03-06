class RemoveProfileReferenceNotNullConstraintInAdress < ActiveRecord::Migration[7.0]
  def change
    change_column :addresses, :profile_id, :bigint, null: true
  end
end

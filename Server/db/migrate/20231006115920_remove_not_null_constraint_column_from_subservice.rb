class RemoveNotNullConstraintColumnFromSubservice < ActiveRecord::Migration[7.0]
  def change
    change_column :subservices, :housemate_service_id, :bigint, null: true
  end
end

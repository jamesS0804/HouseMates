class RemoveUserIdColumnFromHousemateService < ActiveRecord::Migration[7.0]
  def change
    remove_column :housemate_services, :user_id
  end
end

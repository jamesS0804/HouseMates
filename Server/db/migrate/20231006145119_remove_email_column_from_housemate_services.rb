class RemoveEmailColumnFromHousemateServices < ActiveRecord::Migration[7.0]
  def change
    change_column :housemate_services, :email, :string, null: true
  end
end

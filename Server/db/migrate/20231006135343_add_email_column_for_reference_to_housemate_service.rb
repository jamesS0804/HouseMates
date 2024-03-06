class AddEmailColumnForReferenceToHousemateService < ActiveRecord::Migration[7.0]
  def change
    add_column :housemate_services, :email, :string, null: false
  end
end

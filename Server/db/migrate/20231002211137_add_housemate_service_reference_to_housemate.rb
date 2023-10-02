class AddHousemateServiceReferenceToHousemate < ActiveRecord::Migration[7.0]
  def change
    add_reference :housemate_services, :user, null:false, foreign_key: true
  end
end

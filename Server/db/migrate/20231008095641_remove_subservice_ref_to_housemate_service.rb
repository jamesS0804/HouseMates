class RemoveSubserviceRefToHousemateService < ActiveRecord::Migration[7.0]
  def change
    remove_reference :subservices, :housemate_service
  end
end

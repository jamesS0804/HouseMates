class AddServiceReferenceToHousemateService < ActiveRecord::Migration[7.0]
  def change
    add_reference :housemate_services, :service, null: false, foreign_key: true
  end
end

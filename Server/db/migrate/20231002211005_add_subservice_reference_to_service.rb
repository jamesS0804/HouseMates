class AddSubserviceReferenceToService < ActiveRecord::Migration[7.0]
  def change
    add_reference :subservices, :service, null:false, foreign_key: true
  end
end

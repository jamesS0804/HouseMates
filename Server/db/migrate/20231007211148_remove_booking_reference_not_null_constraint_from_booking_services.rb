class RemoveBookingReferenceNotNullConstraintFromBookingServices < ActiveRecord::Migration[7.0]
  def change
    change_column :booking_services, :booking_id, :bigint, null: true
  end
end

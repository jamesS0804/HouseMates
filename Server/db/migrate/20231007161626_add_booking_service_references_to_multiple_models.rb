class AddBookingServiceReferencesToMultipleModels < ActiveRecord::Migration[7.0]
  def change
    add_reference :booking_services, :service, null:false, foreign_key: true
    add_reference :booking_services, :subservice, null:false, foreign_key: true
    add_reference :booking_services, :booking, null:false, foreign_key: true
  end
end

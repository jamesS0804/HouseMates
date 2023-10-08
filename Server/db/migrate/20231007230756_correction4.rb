class Correction4 < ActiveRecord::Migration[7.0]
  def change
    remove_foreign_key :bookings, column: :homeowner_id
  end
end

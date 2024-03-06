class Correction < ActiveRecord::Migration[7.0]
  def change
    change_column :bookings, :homeowner_id, :bigint, foreign_key: true
  end
end

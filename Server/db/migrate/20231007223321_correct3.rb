class Correct3 < ActiveRecord::Migration[7.0]
  def change
    change_column :bookings, :homeowner_id, :bigint, foreign_key: true, null: false, index: true
  end
end

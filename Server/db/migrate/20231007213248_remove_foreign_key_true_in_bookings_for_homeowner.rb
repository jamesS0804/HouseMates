class RemoveForeignKeyTrueInBookingsForHomeowner < ActiveRecord::Migration[7.0]
  def change
    change_column :bookings, :homeowner_id, :bigint, foreign_key: false
  end
end

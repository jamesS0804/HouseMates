class Correct1 < ActiveRecord::Migration[7.0]
  def change
    remove_reference :bookings, :homeowner
  end
end

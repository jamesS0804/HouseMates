class ChangeAddressRefToProfile < ActiveRecord::Migration[7.0]
  def change
    remove_reference :addresses, :user, foreign_key: true
    add_reference :addresses, :profile, null:false, foreign_key: true
  end
end

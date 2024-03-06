class Correct < ActiveRecord::Migration[7.0]
  def change
    change_column :housemate_services, :email, :string, null: false
  end
end

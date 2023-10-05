class CreateHousemateServices < ActiveRecord::Migration[7.0]
  def change
    create_table :housemate_services do |t|

      t.timestamps
    end
  end
end

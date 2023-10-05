class CreateHousemates < ActiveRecord::Migration[7.0]
  def change
    create_table :housemates do |t|
      t.string :type

      t.timestamps
    end
  end
end

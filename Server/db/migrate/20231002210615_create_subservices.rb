class CreateSubservices < ActiveRecord::Migration[7.0]
  def change
    create_table :subservices do |t|
      t.string :title, null: false
      t.decimal :price, precision: 10, scale: 2, null: false

      t.timestamps
    end
  end
end

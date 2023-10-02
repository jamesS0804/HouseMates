class CreateAddresses < ActiveRecord::Migration[7.0]
  def change
    create_table :addresses do |t|
      t.string :address_line_1, null: false, default: ""
      t.string :barangay, null: false, default: ""
      t.string :city, null: false, default: ""
      t.string :province, null: false, default: ""
      t.string :zip_code,  null: false, default: ""

      t.timestamps
    end
  end
end

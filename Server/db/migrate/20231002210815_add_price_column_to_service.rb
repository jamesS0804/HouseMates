class AddPriceColumnToService < ActiveRecord::Migration[7.0]
  def change
    add_column :services, :price, :decimal, precision: 10, scale: 2, null: false
  end
end

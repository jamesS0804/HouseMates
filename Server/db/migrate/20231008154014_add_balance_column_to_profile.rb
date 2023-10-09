class AddBalanceColumnToProfile < ActiveRecord::Migration[7.0]
  def change
    add_column :profiles, :balance, :decimal, precision: 10, scale: 2
  end
end

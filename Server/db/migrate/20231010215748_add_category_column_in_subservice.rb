class AddCategoryColumnInSubservice < ActiveRecord::Migration[7.1]
  def change
    add_column :subservices, :category, :string
  end
end

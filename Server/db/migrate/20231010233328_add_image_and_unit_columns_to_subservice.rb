class AddImageAndUnitColumnsToSubservice < ActiveRecord::Migration[7.1]
  def change
    add_column :subservices, :image_url, :string
    add_column :subservices, :unit, :string
  end
end

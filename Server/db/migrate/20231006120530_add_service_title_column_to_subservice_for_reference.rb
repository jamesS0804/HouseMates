class AddServiceTitleColumnToSubserviceForReference < ActiveRecord::Migration[7.0]
  def change
    add_column :subservices, :service_title, :string, null: false
  end
end

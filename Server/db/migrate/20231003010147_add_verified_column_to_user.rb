class AddVerifiedColumnToUser < ActiveRecord::Migration[7.0]
  def change
    add_column :users, :isVerified, :boolean, default: false
  end
end

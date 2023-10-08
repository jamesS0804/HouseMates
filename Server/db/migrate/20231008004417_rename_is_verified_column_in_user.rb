class RenameIsVerifiedColumnInUser < ActiveRecord::Migration[7.0]
  def change
    rename_column :users, :isVerified, :is_verified
  end
end

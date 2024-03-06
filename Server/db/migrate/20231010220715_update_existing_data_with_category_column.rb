class UpdateExistingDataWithCategoryColumn < ActiveRecord::Migration[7.1]
  def up
    Subservice.where(category: nil).update_all(category: "Home Type")
  end
end

class AddCategoryIdToArtists < ActiveRecord::Migration
  def self.up
    add_column :artists, :category_id, :integer
  end

  def self.down
    remove_column :artists, :category_id
  end
end

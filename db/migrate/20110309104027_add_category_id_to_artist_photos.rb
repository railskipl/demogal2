class AddCategoryIdToArtistPhotos < ActiveRecord::Migration
  def self.up
    add_column :artist_photos, :category_id, :integer
  end

  def self.down
    remove_column :artist_photos, :category_id
  end
end

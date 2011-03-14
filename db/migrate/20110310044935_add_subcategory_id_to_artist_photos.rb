class AddSubcategoryIdToArtistPhotos < ActiveRecord::Migration
  def self.up
    add_column :artist_photos, :subcategory_id, :integer
  end

  def self.down
    remove_column :artist_photos, :subcategory_id
  end
end

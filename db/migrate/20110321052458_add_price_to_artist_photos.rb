class AddPriceToArtistPhotos < ActiveRecord::Migration
  def self.up
    add_column :artist_photos, :price, :decimal
  end

  def self.down
    remove_column :artist_photos, :price
  end
end

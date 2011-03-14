class AddSetSliderToArtistPhotos < ActiveRecord::Migration
  def self.up
    add_column :artist_photos, :set_slider, :integer
  end

  def self.down
    remove_column :artist_photos, :set_slider
  end
end

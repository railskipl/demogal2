class AddArtistPhotoIdToLineItems < ActiveRecord::Migration
  def self.up
    add_column :line_items, :artist_photo_id, :integer
  end

  def self.down
    remove_column :line_items, :artist_photo_id
  end
end

class CreateArtistPhotos < ActiveRecord::Migration
  def self.up
    create_table :artist_photos do |t|
      t.string :artist_id
      t.string :code
      t.string :title
      t.string :dimension
      t.text :description

      t.timestamps
    end
  end

  def self.down
    drop_table :artist_photos
  end
end

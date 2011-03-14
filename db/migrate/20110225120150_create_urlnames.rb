class CreateUrlnames < ActiveRecord::Migration
  def self.up
    create_table :urlnames do |t|
      t.string :nameable_type
      t.string :nameable_id
      t.string :name

      t.timestamps
    end
  end

  def self.down
    drop_table :urlnames
  end
end

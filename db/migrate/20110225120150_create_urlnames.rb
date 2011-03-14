class CreateUrlnames < ActiveRecord::Migration
  def self.up
    create_table :urlnames do |t|
      t.string :nameable_type
      t.string :nameable_id
      t.string :name
     
      rename_column :urlnames,:nameable_id,  :nameable_id_string 
        create_column :urlnames, :nameable_id, :integer

        Urlnames.reset_column_information
        Urlnames.find_each { |c| c.update_attribute(:nameable_id, c.nameable_id_string) } 
        delete_column :urlnames, :nameable_id_string
      t.timestamps
    end
  end

  def self.down
    add_column :urlnames, :nameable_id_old
        remove_column :urlnames, :nameable_id
        rename_column :urlnames, :nameable_id_old, :nameable_id
   # drop_table :urlnames
  end
end

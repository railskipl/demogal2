class Artist < ActiveRecord::Base
  
  
  validates_presence_of :name, :artist_info, :contact_person
  validates_uniqueness_of :name
  validates_length_of :name, :within => 2..100
  validates_length_of :artist_info, :within => 5..10000
  
  
  has_attached_file :photo, 
                    :styles => { :thumb => "" },
                    
                    :convert_options => {
                          :thumb => "-gravity center -thumbnail 85x75^ -extent 85x75"
                      }
                   
  
  has_many :artist_photos
  
 end

class LineItem < ActiveRecord::Base
  belongs_to :order
  belongs_to :artist_photo

  def self.from_cart_item(cart_item)
    li = self.new
    li.artist_photo    = cart_item.artist_photo
    li.quantity    = cart_item.quantity
    li.total_price = cart_item.price
    li
  end
end
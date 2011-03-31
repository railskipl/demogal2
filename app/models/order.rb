class Order < ActiveRecord::Base
  

  has_many :line_items

  validates_presence_of :name, :address, :email

  def add_line_items_from_cart(cart)
    cart.items.each do |item|
      li = LineItem.from_cart_item(item)
      line_items << li
    end
  end
  
  def paypal_url(return_url)
    values = {
      :business => 'seller_1300430419_biz@kunalinfotech.net',
      :cmd => '_cart',
      :upload => 1,
      :return => return_url,
      :invoice => id
    }
    line_items.each_with_index do |item, index|
      values.merge!({
        "amount_#{index+1}" => item.total_price,
        "item_name_#{index+1}" => item.artist_photo.title,
        "item_number_#{index+1}" => item.id,
        "quantity_#{index+1}" => item.quantity
      })
    end
    "https://www.sandbox.paypal.com/cgi-bin/webscr?" + values.to_query
  end
  
end

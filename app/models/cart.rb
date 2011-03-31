class Cart
  attr_reader :items

  def initialize
    @items = []
  end

  def total_price
    @items.sum { |item| item.price }
  end

  def total_items
    @items.sum { |item| item.quantity }
  end

  def add_product(artist_photo)
    current_item = @items.find {|item| item.artist_photo == artist_photo}
    if current_item
      current_item.increment_quality
    else
      current_item = CartItem.new(artist_photo)
      @items << current_item
    end
    current_item
  end
  

end

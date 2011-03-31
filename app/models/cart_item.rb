class CartItem

  attr_reader :artist_photo, :quantity

  def initialize(artist_photo)
    @artist_photo = artist_photo
    @quantity = 1
    
  end

  def increment_quality
    @quantity += 1
  end

  def title
    @artist_photo.title
  end

  def price
    @artist_photo.price * @quantity
  end

end
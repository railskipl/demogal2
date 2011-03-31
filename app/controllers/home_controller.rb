class HomeController < ApplicationController
	
	before_filter :find_cart, :except => :empty_cart
  
  def index
    @artist_photos = ArtistPhoto.find(:all, :conditions=>"set_slider='1'")
    @title = "Home"

    respond_to do |format|
      format.html # index.html.erb
      format.xml  { render :xml => @artist_photos }
    end
    
  end
  
  def showpages
  	@page = Page.find_by_urlname(params[:id])
  	
  	if @page.nil?
    	redirect_to_index("Wrong post it")	    
    else
	    
	    @meta_title = "Fine Art Gallery | Nagpur Art Gallery - #{@page.title}"
    	  
	    respond_to do |format|
	      format.html # showpages.html.erb
	      format.xml  { render :xml => @page }
	    end
	end	
  end
  
  
  def artwork
    @artist_photo = ArtistPhoto.find_by_urlname(params[:id])
    
	    if @artist_photo.nil?
	    	redirect_to_index("Wrong post it")
	    else
	    
			    @artist = Artist.find(@artist_photo.artist_id)
			    
			    @subcat = SubCategory.find(@artist_photo.subcategory_id)
			  	@sub_cat_id  = @subcat.id
			  	
			  	@meta_title = "#{@artist.name} | #{@artist_photo.title} | #{@subcat.title}"
			  	@meta_keywords = "#{@artist.name}, #{@artist_photo.title}, original art, affordable art, fine art gallery,"
			  	@meta_description = "#{@artist.name} - Buy the original #{@subcat.title} titled “#{@artist_photo.title}” and other affordable art at our fine art gallery."
			  	
			
			    respond_to do |format|
			      format.html # artwork.html.erb
			      format.xml  { render :xml => @artist_photo }
	    		end
	    end
	end
	
  
  def portfolio
  	 @artist_photos = ArtistPhoto.find_all_by_artist_id(params[:id])
  	 
  	 @title = "Art Works"

     @meta_title = "Artist Portfolio | Fine Art Gallery | Nagpur Art Gallery"
     
    respond_to do |format|
      format.html # artwork.html.erb
      format.xml  { render :xml => @artist_photos }
    end
  end
  
  def showcat
  	@artist_photos = ArtistPhoto.find_all_by_subcategory_id(params[:id])
  	
  	@subcat = SubCategory.find(params[:id])
  	@sub_cat_id  = @subcat.id
  	@title = "Art Works"
  	
	  	@meta_title = "#{@subcat.title} | Fine Art Gallery | Nagpur Art Gallery"
	  	@meta_keywords = "#{@subcat.title}, original #{@subcat.title}, buy #{@subcat.title}, buy fine art, original art, affordable art, fine art, art for sale"
	  	@meta_description = "#{@subcat.title} for sale from professional, national, and student artists."
  	
  	
    respond_to do |format|
      format.html # artwork.html.erb
      format.xml  { render :xml => @artist_photos }
    end
  end
    
  def artistwork
    	redirect_to("/artworks/artist-categories/1") 
  end
  
  def search
  	  @artist_photos = ArtistPhoto.find(:all, :conditions=>['title LIKE ?', "%#{params[:search_string]}%"])
  	  
  	  
  	  
  	  respond_to do |format|
      format.html # artwork.html.erb
      format.xml  { render :xml => @artist_photos }
    end 
  end
  
  
  def add_to_cart
    artist_photo = ArtistPhoto.find(params[:id])
    @current_item = @cart.add_product(artist_photo)
    respond_to do |format|
      format.js if request.xhr?
      format.html {redirect_to_index}
    end
  rescue ActiveRecord::RecordNotFound
    logger.error("Attempt to access invalid artist_photo #{params[:id]}")
    redirect_to_index "Invalid Artworks"
  end
  
  def empty_cart
    session[:cart] = nil
    find_cart
    respond_to do |format|
      format.js if request.xhr?
      format.html {redirect_to_index}
    end
  end

  def checkout
    if @cart.items.empty?
      redirect_to_index("Your cart is empty")
    else
      @order = Order.new
    end
  end

  def save_order
    @order = Order.new(params[:order])
    @order.add_line_items_from_cart(@cart)
    
    if @order.save
      session[:cart] = nil
      
      redirect_to(@order.paypal_url('/'))
    else
      render :action => 'checkout'
    end
  end

protected
  def authorize
  end

private
  
  def find_cart
    @cart = session[:cart] ||= Cart.new # return an existing or new cart
  end

  def redirect_to_index(msg = nil)
    flash[:notice] = msg if msg
    redirect_to :action => 'index'
  end
  
  
  
    
  def fail
    redirect_to '/500.html'
  end
  
  def exception
    raise 'exception test'
  end
    
end

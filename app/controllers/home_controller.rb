class HomeController < ApplicationController
  
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
    @title = @page.title
    
    respond_to do |format|
      format.html # showpages.html.erb
      format.xml  { render :xml => @page }
    end
  end
  
  def artwork
    @artist_photo = ArtistPhoto.find_by_urlname(params[:id])
    
    @artist = Artist.find(@artist_photo.artist_id)
    
    @subcat = SubCategory.find(@artist_photo.subcategory_id)
  	@sub_cat_id  = @subcat.id

    respond_to do |format|
      format.html # artwork.html.erb
      format.xml  { render :xml => @artist_photo }
    end
  end
  
  def portfolio
  	 @artist_photos = ArtistPhoto.find_all_by_artist_id(params[:id])

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
    
  def fail
    redirect_to '/500.html'
  end
  
  def exception
    raise 'exception test'
  end
    
end

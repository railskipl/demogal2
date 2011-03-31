class HomeController < ApplicationController
	
	

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

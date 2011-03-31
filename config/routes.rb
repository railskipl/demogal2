ActionController::Routing::Routes.draw do |map|
  map.resources :sub_categories

  map.resources :categories
  
  map.connect '/categories/sub-categories/:id', :controller=>'categories', :action=> 'addsubcat'
  
  map.connect '/pages/:id', :controller=>'home', :action=> 'showpages'
  
  map.connect '/content-pages/', :controller=>'pages', :action=> 'index'
  map.connect '/content-pages/new', :controller=>'pages', :action=> 'new'
  map.connect '/content-pages/create', :controller=>'pages', :action=> 'create'
  map.connect '/content-pages/:id/edit', :controller=>'pages', :action=> 'edit'
  map.connect '/content-pages/:id/update', :controller=>'pages', :action=> 'update'
  map.connect '/content-pages/:id/delete', :controller=>'pages', :action=> 'destroy'

  map.resources :pages

  map.resources :artist_photos
  
  map.connect '/sliders/', :controller=>'artist_photos', :action=> 'slider'

  map.resources :artists

  map.connect '/artist-photo/:id', :controller=>'artists', :action=> 'showphoto'
  map.connect '/artist-photo/subcat/:id', :controller=>'artists', :action=> 'addsubcat'
  
  map.root :controller => 'home', :action => 'index'
  
  
  map.connect '/artist/artworks', :controller=>'home', :action=> 'artistwork'
  map.connect '/artworks/:id', :controller=>'home', :action=> 'artwork'
  map.connect '/artworks/artist-categories/:id', :controller=>'home', :action=> 'showcat'
  map.connect '/portfolio/artist/:id', :controller=>'home', :action=> 'portfolio'
  map.connect '/artist-artworks/search', :controller=>'home', :action=> 'search'
  
  map.connect '/artworks/cart/:id', :controller=>'home', :action=> 'add_to_cart'  
  map.connect '/cart/checkout', :controller=>'home', :action=> 'checkout'
  map.connect '/cart/save_order', :controller=>'home', :action=> 'save_order'
  
  map.resources :messages
  map.resource :session
  map.resources :users, :member => {:suspend => :put, :unsuspend => :put, :purge => :delete}
  map.activate '/activate/:activation_code', :controller => 'users', :action => 'activate', :activation_code => nil
  
  map.fail '/admin/fail', :controller => 'home', :action => 'fail'
  map.exception '/admin/exception', :controller => 'home', :action => 'exception'
  map.logout '/admin/logout', :controller => 'sessions', :action => 'destroy'
  map.login '/admin/login', :controller => 'sessions', :action => 'new'
 
  map.register '/register', :controller => 'users', :action => 'create'
   map.signup '/signup', :controller => 'users', :action => 'new'
  
  map.settings '/admin/settings', :controller => 'users', :action => 'edit'
  
  map.profile ':login', :controller => 'users', :action => 'show'
  
  map.connect ':controller/:action/:id'
  map.connect ':controller/:action/:id.:format'
  
end

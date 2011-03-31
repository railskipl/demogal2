class SessionsController < ApplicationController

  def new
  	
   end

  def create
    logout_keeping_session!
    user = User.authenticate(params[:login], params[:password])
    if user
      self.current_user = user
      new_cookie_flag = (params[:remember_me] == "1")
      handle_remember_cookie! new_cookie_flag
      redirect_back_or_default('/artists')
    else
      flash[:error] = "Invalid username or password combination."
      
      @login       = params[:login]
      @remember_me = params[:remember_me]
      redirect_back_or_default('/admin/login')
    end
  end

   

  def destroy
    logout_killing_session!
    redirect_back_or_default('/admin/login')
  end

end

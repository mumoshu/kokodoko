require 'ostruct'

class LoginController < ApplicationController
  def index
    redirect_to :controller => "quizzes" if session[:user]
  end
  
  def login
    if using_open_id?
        authenticate
    else
      flash[:error] = "You must provide an OpenID URL"
      redirect_to :action => "index"
    end
  end

  def logout
    session[:user] = nil
    flash[:notice] = "You have logged out."
    redirect_to :action => "index"
  end

  protected
  def authenticate
    authenticate_with_open_id(
                              params[:openid_url], :required => [:nickname, :email]) do
      |result, identity_url, registration|
      
      if result.successful?
        user = OpenStruct.new
        user.identity_url = identity_url
        user.nickname = registration["nickname"]
        user.email = registration["email"]
        @user = User.find(:first, :conditions => { :identity_url => identity_url } ) || User.new
        @user.identity_url ||= identity_url
        @user.nickname ||= registration["nickname"]
        @user.save
        session[:user_id] = @user
        session[:user] = @user

        jumpto = session[:jumpto] || { :controller => "quizzes" }
#        flash[:notice] = "jumpto => #{jumpto.inspect}, registration => #{registration.inspect}"
        session[:jumpto] = nil
        redirect_to(jumpto)
      else
        flash[:error] = result.message
        redirect_to :action => "index"
      end
    end
  end

  def root_url
    openid_url
  end
end


# Filters added to this controller apply to all controllers in the application.
# Likewise, all the methods added will be available for all controllers.

class ApplicationController < ActionController::Base
  require_dependency "openid"
  require_dependency "ostruct"

  helper :all # include all helpers, all the time

  def authorize
    return if session[:user_id]
    flash[:notice] = "Please log in"
    session[:jumpto] = request.parameters
    redirect_to(:controller => "/login", :action => "index")
  end

  # See ActionController::RequestForgeryProtection for details
  # Uncomment the :secret if you're not using the cookie session store
  protect_from_forgery # :secret => '384ef063d4465057b590d5690ed4129d'
  
  # See ActionController::Base for details 
  # Uncomment this to filter the contents of submitted sensitive data parameters
  # from your application log (in this case, all fields with names like "password"). 
  # filter_parameter_logging :password

  alias old_guard_from_nested_layouts guard_from_nested_layouts
  
  def guard_from_nested_layouts
    return true if request.request_uri =~ /\.xml$/
    old_guard_from_nested_layouts or parent_controller
  end
end

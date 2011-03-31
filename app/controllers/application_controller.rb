class ApplicationController < ActionController::Base
  helper :all
  protect_from_forgery
  filter_parameter_logging :password
  include AuthenticatedSystem
  Time.zone = 'Central Time (US & Canada)'
  
  before_filter :meta_defaults
  private

  def meta_defaults
    @meta_title = "Online Art Exhibition | Buy Original Art for Sale | Landscape and Contemporary Art Paintings from One of the Best Online Fine Art Galleries and Large Format Photography from Nagpur Art gallery"
    @meta_keywords = "fine art galleries, photography, landscape painting, landscape paintings, buy art, original art for sale, fine art gallery, art for sale, art gallery of student, national and professional artists"
    @meta_description = "Buy art – buy original fine art from juried artists. Affordable art for sale, a fine art gallery experience, and a satisfaction guarantee!"
  end
  
  helper_method :current_action, :current_controller
  
  def current_action
    request.path_parameters['action']
  end

  
  def current_controller
    request.path_parameters['controller']
  end
  
end

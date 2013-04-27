Spree::BaseController.class_eval do
  # ProductsHelper needed for seo_url method used when generating
  # taxonomies partial in content/show.html.erb.
  helper :products
  # Use before_filter instead of prepend_before_filter to ensure that
  # ApplicationController filters that the view may require are run.
  before_filter :render_page_if_exists
  before_filter :set_current_user

  # Checks if page is not beeing overriden by static one that starts with /
  #
  # Using request.path allows us to override dynamic pages including
  # the home page, product and taxon pages.
  def render_page_if_exists
    # If we don't know if page exists we assume it's and we query DB.
    # But we realy don't want to query DB on each page we're sure doesn't exist!
    return if Rails.cache.fetch('page_not_exist/'+request.path)

    if @page = Page.visible.find_by_slug(request.path)

      #load @content object to load correct meta_keywords & meta_description
      @content = @page
      
      if @page.layout && !@page.layout.empty?
        render :template => 'static_content/show', :layout => @page.layout
      else
        render :template => 'static_content/show'
      end
    else
      Rails.cache.write('page_not_exist/'+request.path, true)
      return(nil)
    end
  end

  # graceful error handling for cancan authorization exceptions
  rescue_from CanCan::AccessDenied do |exception|
    return unauthorized
  end

  private

  # Redirect as appropriate when an access request fails.  The default action is to redirect to the login screen.
  # Override this method in your controllers if you want to have special behavior in case the user is not authorized
  # to access the requested action.  For example, a popup window might simply close itself.
  def unauthorized
    respond_to do |format|
      format.html do
        if current_user
          flash.now[:error] = I18n.t(:authorization_failure)
          render 'shared/unauthorized', :layout => 'spree_application'
        else
          flash[:error] = I18n.t(:authorization_failure)
          store_location
          redirect_to login_path and return
        end
      end
      format.xml do
        request_http_basic_authentication 'Web Password'
      end
      format.json do
        render :text => "Not Authorized \n", :status => 401
      end
    end
  end

  def store_location
    # disallow return to login, logout, signup pages
    disallowed_urls = [signup_url, login_url, destroy_user_session_path]
    disallowed_urls.map!{|url| url[/\/\w+$/]}
    unless disallowed_urls.include?(request.fullpath)
      session["user_return_to"] = request.fullpath
    end
  end

  def set_current_user
    User.current = current_user
  end
end

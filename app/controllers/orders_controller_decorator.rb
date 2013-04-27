OrdersController.class_eval do
  before_filter :check_authorization
  after_filter :clear_promotions

  private

  def check_authorization
    session[:access_token] ||= params[:token]
    order = Order.find_by_number(params[:id]) || current_order

    if order
      authorize! :edit, order, session[:access_token]
    else
      authorize! :create, Order
    end
  end

  def clear_promotions
    current_order.promotion_credits.destroy_all if current_order
  end

end

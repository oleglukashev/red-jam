RedJam::Application.routes.draw do
  resources :addresses, :only => [:edit, :update, :destroy]

  namespace :api do
    resources :shipments, :except => [:new,:edit] do
      put :event, :on => :member
      resources :inventory_units, :except => [:new,:edit] do
        put :event, :on => :member
      end
    end
    resources :orders, :except => [:new,:edit] do
      put :event, :on => :member
      resources :shipments, :except => [:new,:edit]
      resources :line_items, :except => [:new,:edit]
      resources :inventory_units, :except => [:new,:edit] do
        put :event, :on => :member
      end
    end
    resources :inventory_units, :except => [:new,:edit] do
      put :event, :on => :member
    end
    resources :products, :except => [:new,:edit]
    resources :countries, :except => [:new,:edit] do
      resources :states, :except => [:new,:edit]
    end
    resources :states, :except => [:new,:edit]
  end

  devise_for :user,
             :controllers => { :sessions => 'user_sessions',
                               :registrations => 'user_registrations',
                               :passwords => "user_passwords" },
             :skip => [:unlocks, :omniauth_callbacks],
             :path_names => { :sign_out => 'logout'}
  resources :users, :only => [:edit, :update]

  devise_scope :user do
    get "/login" => "user_sessions#new", :as => :login
    get "/signup" => "user_registrations#new", :as => :signup
  end


  match '/checkout/registration' => 'checkout#registration', :via => :get, :as => :checkout_registration
  match '/checkout/registration' => 'checkout#update_registration', :via => :put, :as => :update_checkout_registration

  match '/orders/:id/token/:token' => 'orders#show', :via => :get, :as => :token_order

  resource :session do
    member do
      get :nav_bar
    end
  end
  resource :account, :controller => "users"

  root :to => 'products#index'

  resources :products

  match '/locale/set' => 'locale#set'

  resources :tax_categories

  resources :states, :only => :index

  # non-restful checkout stuff
  match '/checkout/update/:state' => 'checkout#update', :as => :update_checkout
  match '/checkout/:state' => 'checkout#edit', :as => :checkout_state
  match '/checkout' => 'checkout#edit', :state => 'address', :as => :checkout

  # non-restful admin checkout stuff
  match '/admin/orders/:order_number/checkout' => 'admin/checkout#update', :method => :post, :as => :admin_orders_checkout
  match '/admin/orders/:order_number/checkout/(:state)' => 'admin/checkout#edit', :method => :get, :as => :admin_orders_checkout

  resources :orders do
    post :populate, :on => :collection

    resources :line_items
    resources :creditcards
    resources :creditcard_payments

    resources :shipments do
      member do
        get :shipping_method
      end
    end

  end
  match '/cart', :to => 'orders#edit', :via => :get, :as => :cart
  match '/cart', :to => 'orders#update', :via => :put, :as => :update_cart
  match '/cart/empty', :to => 'orders#empty', :via => :put, :as => :empty_cart

  resources :shipments do
    member do
      get :shipping_method
      put :shipping_method
    end
  end

  match 's/*product_group_query' => 'products#index', :as => :simple_search
  match '/pg/:product_group_name' => 'products#index', :as => :pg_search
  match '/t/*id/s/*product_group_query' => 'taxons#show', :as => :taxons_search
  match 't/*id/pg/:product_group_name' => 'taxons#show', :as => :taxons_pg_search

  match '/t/*id' => 'taxons#show', :as => :nested_taxons
  
  namespace :admin do
    resources :users do
      member do
        put :generate_api_key
        put :clear_api_key
      end
    end

    resource :yandex_market_settings do
      member do
        match :general
        match :currency
        match :export_files
        match :ware_property
        get :run_export
      end
    end
    
    resources :promotions do
      resources :promotion_rules
    end

    resources :pages
    resource :online_support_settings, :only => ['show', 'update', 'edit']
    resource :editor_settings, :only => ['show', 'update', 'edit']
    resources :zones
    resources :users
    resources :countries do
      resources :states
    end
    resources :states
    resources :tax_categories
    resources :configurations, :only => :index
    resources :products do
      resources :product_properties
      resources :images do
        collection do
          post :update_positions
        end
      end
      member do
        get :clone
      end
      resources :variants do
        collection do
          post :update_positions
        end
      end
      resources :option_types do
        member do
          get :select
          get :remove
        end
        collection do
          get :available
          get :selected
        end
      end
      resources :taxons do
        member do
          get :select
          delete :remove
        end
        collection do
          post :available
          post :batch_select
          get  :selected
        end
      end
    end
    resources :option_types do
      collection do
        post :update_positions
      end
    end
    
    resources :properties do
      collection do
        get :filtered
      end
    end

    resources :prototypes do
      member do
        get :select
      end

      collection do
        get :available
      end
    end

    resource :inventory_settings
    resources :google_analytics

    resources :orders do
      member do
        put :fire
        get :fire
        post :resend
        get :history
        get :user
      end

      resources :adjustments
      resources :line_items
      resources :shipments do
        member do
          put :fire
        end
      end
      resources :return_authorizations do
        member do
          put :fire
        end
      end
      resources :payments do
        member do
          put :fire
        end
      end
    end

    resource :general_settings do
      collection do
        post :dismiss_alert
      end
    end

    resources :taxonomies do
      member do
        get :get_children
      end

      resources :taxons
    end

    resources :reports, :only => [:index, :show] do
      collection do
        get :sales_total
      end
    end

    resources :shipments
    resources :shipping_methods
    resources :shipping_categories
    resources :tax_rates
    resource  :tax_settings
    resources :calculators
    resources :product_groups do
      resources :product_scopes
    end


    resources :trackers
    resources :payment_methods
    resources :mail_methods
  end

  match '/admin' => 'admin/orders#index', :as => :admin
  match '/content/cvv' => 'content#cvv'
  match '/*path' => 'content#show'
  match '/admin' => 'admin/overview#index', :as => :admin
  match '/admin/overview/get_report_data' => 'admin/overview#get_report_data'

  resources :sitemap
  resources :content_images, :only => [:create]
  resources :content_files, :only => [:create]


  # Add your extension routes here
  namespace :gateway do
    match '/robokassa/:gateway_id/:order_id' => 'robokassa#show',    :as => :robokassa
    match '/robokassa/result'                => 'robokassa#result',  :as => :robokassa_result
    match '/robokassa/success'               => 'robokassa#success', :as => :robokassa_success
    match '/robokassa/fail'                  => 'robokassa#fail',    :as => :robokassa_fail
  end


  match '/static/*path', :to => 'static_content#show', :via => :get, :as => 'static'

  namespace :admin do
    
  end

  # Add your extension routes here
  match "/admin/products/import_from_yandex_market" => "admin/products#import_from_yandex_market", :as => :import_from_yandex_market
  match "/admin/orders/:id/courier_instruction" => "admin/orders#courier_instruction", :as => :orders_courier_instruction
  match "/orders/:id/sberbank_invoice" => "orders#sberbank_invoice", :as => :orders_sberbank_invoice

  # Add your extension routes here
  root :controller => "home", :action => "index"
end

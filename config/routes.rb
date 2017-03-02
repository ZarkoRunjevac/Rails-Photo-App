Rails.application.routes.draw do

  
  #resources :thing_type_of_things, except: [:new, :edit]
  get 'authn/whoami',  defaults: {format: :json}

  get 'authn/checkme'

  mount_devise_token_auth_for 'User', at: 'auth'


  scope :api, defaults: {format: :json} do
    resources :cities, except: [:new, :edit]
    resources :states, except: [:new, :edit]
    resources :images, except: [:new, :edit] do
      post "thing_images",  controller: :thing_images, action: :create
      get "thing_images",  controller: :thing_images, action: :image_things
      get "linkable_things",  controller: :thing_images, action: :linkable_things
    end
    resources :things, except: [:new, :edit] do
      resources :thing_images, only: [:index, :create, :update, :destroy]
      resources :type_of_things, only: [:create, :destroy, :linkable_type_of_things], controller: :thing_type_of_thingss
      get "linkable_tags" , controller: :thing_type_of_things, action: :linkable_tags
      resources :thing_type_of_things, only: [:index,:create, :destroy]
      get "thing_tags", controller: :thing_type_of_things, action: :thing_tags
      post "thing_tags", controller: :thing_type_of_things, action: :create
    end

    resources :type_of_things, except: [:new, :edit] do
      resources :thing_type_of_things, only: [:index,:create, :destroy]
    end
  end

  root "ui#index"
  get "/ui"=>'ui#index'
  get "/ui#"=>'ui#index'
end

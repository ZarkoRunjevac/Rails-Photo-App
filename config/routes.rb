Rails.application.routes.draw do


  #resources :thing_tags, except: [:new, :edit]
  get 'authn/whoami',  defaults: {format: :json}

  get 'authn/checkme'

  mount_devise_token_auth_for 'User', at: 'auth', controllers: {
      registrations: 'registrations'
  }


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
      resources :tags, only: [:create, :destroy, :linkable_tags], controller: :thing_tags
      get "linkable_tags" , controller: :thing_tags, action: :linkable_tags
      resources :thing_tags, only: [:index,:create, :destroy]
      get "thingtags", controller: :thing_tags, action: :thingtags
      post "thingtags", controller: :thing_tags, action: :create
      delete "thingtags", controller: :thing_tags, action: :destroy
    end

    resources :tags, except: [:new, :edit] do
      resources :thing_tags, only: [:index,:create, :destroy]
    end

    get "images/:id/content", as: :image_content, controller: :images, action: :content, defaults:{format: :jpg}

    get 'geocoder/addresses' => "geocoder#addresses"

    get 'geocoder/positions' => "geocoder#positions"

    get 'subjects' => "thing_images#subjects"
    get 'types' => "tags#tags_with_things"
  end

  root "ui#index"
  get "/ui"=>'ui#index'
  get "/ui#"=>'ui#index'
end

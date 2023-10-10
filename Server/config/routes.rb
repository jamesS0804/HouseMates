Rails.application.routes.draw do
  devise_for :users, path: '', path_names: {
    sign_in: 'login',
    sign_out: 'logout',
    registration: 'signup'
  },
  controllers: {
    sessions: 'users/sessions',
    registrations: 'users/registrations',
    confirmations: 'users/confirmations'
  }
  namespace :api do
    namespace :v1 do
      resources :homeowners
      resources :housemates
      resources :profiles
      resources :services
      resources :subservices
      resources :housemate_services
      resources :bookings
    end
  end
end
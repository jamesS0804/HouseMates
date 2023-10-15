require 'rails_helper'

RSpec.describe Users::ConfirmationsController, type: :controller do
  let(:user) { User.create(email: 'test@example.com', password: 'password', type: 'Homeowner') }

  before(:each) do
    request.env['devise.mapping'] = Devise.mappings[:user]
  end

  describe 'GET #show' do
    it 'redirects to the specified URL if the resource is confirmed successfully' do
      get :show, params: { confirmation_token: user.confirmation_token }
      
      expect(response).to redirect_to('https://housemate-frontend.onrender.com/')
    end
  end
end
class Users::ConfirmationsController < Devise::ConfirmationsController
  def show
    super do |resource|
      if resource.errors.empty?
        redirect_to 'https://housemate-frontend.onrender.com/',allow_other_host: true and return
      end
    end
  end
end

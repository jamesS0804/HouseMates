class Users::RegistrationsController < Devise::RegistrationsController
  include JsonRender
  respond_to :json
  before_filter :update_sanitized_params, if: :devise_controller?

  def update_sanitized_params
    devise_parameter_sanitizer.for(:sign_up) {|u| u.permit(:is_verified, :is_active, :email, :password, :password_confirmation)}
    devise_parameter_sanitizer.for(:account_update) {|u| u.permit(:is_verified, :is_active, :email, :password, :password_confirmation, :current_password)}
  end

  def create
    build_resource(sign_up_params)

    resource.save
    if resource.persisted?
      data = UserSerializer.new(resource).serializable_hash[:data][:attributes]
      message = 'Signed up successfully.'
    else
      status_code = 422
      message = "User couldn't be created successfully. #{resource.errors.full_messages.to_sentence}"
    end
    render_json_response(status_code: status_code, message: message, data: data)
  end

  private

  def render_json_response(status_code: nil, message: , data: nil)
    render_json(status_code, message , data)
  end

  def sign_up_params
    params.require(:user).permit(:email, :password, :type)
  end
end

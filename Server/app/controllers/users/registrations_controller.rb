class Users::RegistrationsController < Devise::RegistrationsController
  include JsonRender
  respond_to :json

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
    params.require(:user).permit(:name, :email, :password)
  end
end

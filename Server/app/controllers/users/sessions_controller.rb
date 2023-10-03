class Users::SessionsController < Devise::SessionsController
  include JsonRender
  respond_to :json

  private

  def respond_with(resource, _opts={})
    expiry_object = Time.parse("#{Time.now + 30.minutes.to_i}")
    expiry_in_seconds = expiry_object.to_i

    response.headers['expiry'] = expiry_in_seconds
    render_json_response(message: 'Logged in successfully', data: { user: UserSerializer.new(resource).serializable_hash[:data][:attributes] })
  end

  def respond_to_on_destroy
    begin
      jwt_payload = JWT.decode(request.headers['Authorization'].split(' ')[1], ENV['DEVISE_JWT_SECRET_KEY'], true, algorithm: 'HS256', verify_jti: true)
      user_id = jwt_payload[0]['sub']
      current_user = User.find(user_id)

      if current_user
        sign_out(current_user)
        render_json_response(message: 'logged out successfully')
      end
    rescue JWT::DecodeError
      render_json_response(status_code: 401, message: 'Invalid authentication token.')
    end
  end

  def render_json_response(status_code: nil, message: , data: nil)
    render_json(status_code, message , data)
  end
end

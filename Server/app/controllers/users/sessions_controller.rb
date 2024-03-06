class Users::SessionsController < Devise::SessionsController
  respond_to :json

  private

  def respond_with(resource, _opts = {})
    expiry_object = Time.parse("#{Time.now + 15.minutes.to_i}")
    expiry_in_seconds = expiry_object.to_i

    response.headers['expiry'] = expiry_in_seconds
    render json: { data: UserSerializer.new(resource).serializable_hash[:data][:attributes], status: :ok }
  end

  def respond_to_on_destroy
    jwt_payload = JWT.decode(request.headers['Authorization'].split(' ')[1], ENV['DEVISE_JWT_SECRET_KEY'], true, algorithm: 'HS256', verify_jti: true)
      user_id = jwt_payload[0]['sub']
      current_user = User.find(user_id)

    if current_user
      current_user.update(is_active: false)
      sign_out(current_user)
      render json: { status: :ok }
    end
  end
end
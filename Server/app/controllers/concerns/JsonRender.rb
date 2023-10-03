module JsonRender
    extend ActiveSupport::Concern
  
    def render_json(status_code, message , data)
        if status_code.nil?
            render_success_response(data , message)
        else
            render_error_response(status_code , message)
        end
    end

    private

    def render_success_response(data = nil, message)
        render json: {
            status: { code: 200, message: message },
            data: data
        }, status: :ok
    end

    def render_error_response(status_code, message)
        status = case status_code
                    when 422
                        :unprocessable_entity
                    when 403
                        :forbidden
                    when 401
                        :unauthorized
                    else
                        :not_found
                end
        render json: {
            status: { code: status_code, message: message }
        }, status: status
    end
  end
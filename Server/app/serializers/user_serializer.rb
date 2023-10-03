class UserSerializer
  include JSONAPI::Serializer
  attributes :email, :type
end

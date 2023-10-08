class UserSerializer
  include JSONAPI::Serializer
  attributes :id, :email, :is_verified, :type
end

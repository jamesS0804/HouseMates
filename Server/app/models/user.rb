class User < ApplicationRecord
  include Devise::JWT::RevocationStrategies::JTIMatcher

  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable, :confirmable,
         :jwt_authenticatable, jwt_revocation_strategy: self

  has_one :profile, foreign_key: 'email', primary_key: 'email', dependent: :destroy

  self.inheritance_column = :type
end

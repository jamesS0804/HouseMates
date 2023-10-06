class Housemate < User
    has_many :housemate_services, dependent: :destroy
end

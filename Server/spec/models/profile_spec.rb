require 'rails_helper'

RSpec.describe Profile, type: :model do
  let(:user) { User.create(email: 'john@example.com', password: 'password', type: 'Homeowner') }
  describe 'validations' do
    it 'is valid with valid attributes' do
      profile = Profile.new(
        name: 'John Doe',
        phone_number: '1234567890',
        email: 'john@example.com',
        user: user
      )
      expect(profile).to be_valid
    end

    it 'is not valid without a name' do
      profile = Profile.new(phone_number: '1234567890', email: 'john@example.com')
      expect(profile).not_to be_valid
      expect(profile.errors[:name]).to include("Name cannot be blank.")
    end

    it 'is not valid without a unique phone number' do
      existing_profile = Profile.create(
        name: 'John Doe',
        phone_number: '1234567890',
        email: 'john@example.com',
        user: user
      )
      new_user = User.create(email: 'jane@example.com', password: 'password', type: 'Homeowner')
      profile = Profile.new(
        name: 'Jane Doe',
        phone_number: '1234567890',
        email: 'jane@example.com',
        user: new_user
      )
      expect(profile).not_to be_valid
      expect(profile.errors[:phone_number]).to include("Phone number already taken.")
    end

    it 'is not valid without an email' do
      profile = Profile.new(name: 'John Doe', phone_number: '1234567890')
      expect(profile).not_to be_valid
      expect(profile.errors[:email]).to include("Email cannot be blank.")
    end
  end

  describe 'after_create' do
    it 'sets the initial balance to 10000' do
      user = User.create(email: 'john@example.com', password: 'password', type: 'Homeowner')
      profile = Profile.create(
        name: 'John Doe',
        phone_number: '1234567890',
        email: 'john@example.com',
        user: user
      )
      profile.reload
      expect(profile.balance).to eq(10000)
    end
  end
end

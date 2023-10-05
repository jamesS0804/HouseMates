# Load the Rails application.
require_relative "application"

app_test = File.join(Rails.root, 'config', 'application.env')
load(app_test) if File.exist?(app_test)

# Initialize the Rails application.
Rails.application.initialize!
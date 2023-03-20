source "https://rubygems.org"

ruby File.read(File.expand_path('.tool-versions', __dir__)).strip.split(" ").last

gem "sinatra"
gem "haml"
gem "sass"
gem "compass"
gem "rake"

group :development do
  gem "sinatra-contrib"
  gem "thin"
end

group :production do
  gem "puma"
  gem "foreman"
end

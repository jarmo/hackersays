# encoding: UTF-8
require "sinatra"
require "haml"
require "yaml"

def quotes
  #@quotes = YAML.load <<-EOF
  #EOF
  @quotes = YAML.load File.read(File.dirname(__FILE__) + "/data.yaml")
end

get '/' do
  @quote = quotes.sample
  haml :index
end


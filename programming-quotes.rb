# encoding: UTF-8
require "sinatra"
require "haml"
require "yaml"
require "yajl"

def quotes
  #@quotes = YAML.load <<-EOF
  #EOF
  f = File.open(File.dirname(__FILE__) + "/data.yaml", "r:utf-8")
  @quotes = YAML.load f.read
ensure
  f.close
end

def format quote
  quote[:c].gsub!($/, "<br>")
  quote[:a] = quote[:a] || "Anonymous"
  quote
end

get '/' do
  @quote = format quotes.sample
  haml :index
end

get '/quote' do
  content_type 'application/json', :charset => 'utf-8'
  Yajl::Encoder.encode format(quotes.sample)
end


# encoding: UTF-8
require "sinatra"
require "haml"
require "sass"
require "compass"
require "yaml"
require "yajl"

class ProgrammingQuotes < Sinatra::Base
  configure do
    Compass.configuration do |config|
      config.project_path = File.dirname(__FILE__)
      config.sass_dir = 'views'
      config.output_style = :compressed
    end

    set :haml, {:format => :html5}
    set :scss, Compass.sass_engine_options
  end

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

  get '/style.css' do
    content_type 'text/css', :charset => 'utf-8'
    scss :style
  end

  run! if app_file == $0

end

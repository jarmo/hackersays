# encoding: UTF-8
require "sinatra"
require "haml"
require "sass"
require "compass"
require "yaml"
require "yajl"
require 'digest/sha1'
require File.expand_path("../ext/www-middleware", __FILE__)

class HackerSays < Sinatra::Base
  configure do
    Compass.configuration do |config|
      config.project_path = File.dirname(__FILE__)
      config.sass_dir = 'views'
      config.output_style = :compressed
    end

    set :haml, {:format => :html5}
    set :scss, Compass.sass_engine_options
    use WwwMiddleware
  end

  def quotes
    return @quotes if production? && !@quotes.nil?

    begin
      f = File.open(File.dirname(__FILE__) + "/quotes.yaml", "r:utf-8")
      raw_quotes = YAML.load f.read
      @quotes = raw_quotes.reduce({}) do |memo, quote|
        quote[:c].gsub!($/, "<br>")
        quote[:a] = quote[:a] || "Anonymous"
        id = Digest::SHA1.hexdigest quote[:a] + quote[:c]
        memo[id[0..5]] = quote
        memo
      end
    ensure
      f.close
    end
  end

  def random_quote
    quote quotes.keys[rand quotes.size]
  end

  def quote(id)
    return unless id
    quotes[id] && quotes[id].merge(:id => id)
  end

  get '/quote' do
    content_type 'application/json', :charset => 'utf-8'
    Yajl::Encoder.encode random_quote
  end

  get '/style.css' do
    content_type 'text/css', :charset => 'utf-8'
    scss :style
  end

  get '/:id?' do
    @quote = quote(params[:id]) || random_quote
    haml :index
  end

  run! if app_file == $0

end

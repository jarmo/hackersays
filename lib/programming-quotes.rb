# encoding: UTF-8
require "sinatra"
require "haml"
require "sass"
require "compass"
require "yaml"
require "yajl"
require 'digest/sha1'
require "./lib/ext/www-middleware"

class ProgrammingQuotes < Sinatra::Base
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
        quote = format quote
        id = Digest::SHA1.hexdigest quote[:a] + quote[:c]
        memo[id[0..5]] = quote
        memo
      end
    ensure
      f.close
    end
  end

  def random_quote
    quotes_by_id = quotes
    quote_id = quotes_by_id.keys.sample
    quotes_by_id[quote_id].merge(:id => quote_id)
  end

  def format quote
    quote[:c].gsub!($/, "<br>")
    quote[:a] = quote[:a] || "Anonymous"
    quote
  end

  get '/' do
    haml :index
  end

  get '/quote' do
    id = params[:id]
    quote_by_id = quotes[id && id[1..-1]]
    quote = quote_by_id ? quote_by_id.merge(:id => id) : random_quote

    content_type 'application/json', :charset => 'utf-8'
    Yajl::Encoder.encode quote
  end

  get '/style.css' do
    content_type 'text/css', :charset => 'utf-8'
    scss :style
  end

  run! if app_file == $0

end

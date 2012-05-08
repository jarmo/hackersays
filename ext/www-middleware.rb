class WwwMiddleware
  def initialize(app)
    @app = app
  end

  def call(env)
    request = Rack::Request.new(env)
    if request.host =~ /heroku|programming-quotes/
      [301, {"Location" => "http://hackersays.com"}, self]
    elsif request.host[0..3] == "www."
      [301, {"Location" => request.url.sub("//www.", "//")}, self]
    else
      @app.call(env)
    end
  end

  def each(&block)
  end
end


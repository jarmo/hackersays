class WwwMiddleware
  def initialize(app)
    @app = app
  end

  def call(env)
    require "ruby-debug"; debugger;
    request = Rack::Request.new(env)
    if request.host.starts_with?("www.")
      [301, {"Location" => request.url.sub("//www.", "//")}, self]
    else
      @app.call(env)
    end
  end

  def each(&block)
  end
end


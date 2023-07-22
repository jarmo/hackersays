if File.exist? "spec"
  require 'rspec/core/rake_task'
  RSpec::Core::RakeTask.new(:spec)
end

def app?
  File.exist? "config.ru"
end

def app_name
  "hackersays"
end

if app?
  desc "Restart app"
  task :restart => [:stop, :start]

  desc "Start app"
  task :start => [:stop, :environment] do
    `
RACK_ENV=production bundle exec rackup -s puma -o 127.0.0.1 >>/var/log/#{app_name}/#{app_name}.log 2>&1 &
echo $! > /var/run/#{app_name}/#{app_name}.pid
`
  end

  desc "Stop app"
  task :stop => :environment do
    `if [ -f /var/run/#{app_name}/#{app_name}.pid ]; then kill -9 $(cat /var/run/#{app_name}/#{app_name}.pid) 2>/dev/null && rm -f /var/run/#{app_name}/#{app_name}.pid || echo "#{app_name} was not running..."; fi`
  end

  task :environment do
    Dir.chdir File.expand_path(File.dirname(__FILE__))
  end
end

task :default => :spec

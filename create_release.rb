require "net/https"
require "json"

#gh_token     = ENV.fetch("GITHUB_TOKEN")
gh_user      = ARGV.fetch(0)
gh_repo      = ARGV.fetch(1)
release_name = ARGV.fetch(2)
release_desc = ARGV[3]

uri = URI("https://api.github.com")
http = Net::HTTP.new(uri.host, uri.port)
http.use_ssl = true
http.verify_mode = OpenSSL::SSL::VERIFY_NONE

request = Net::HTTP::Post.new("/repos/#{gh_user}/#{gh_repo}/releases")
request["Accept"] = "application/vnd.github.manifold-preview"
request["Authorization"] = "token #{gh_token}"
request.body = {
  "tag_name"         => release_name,
  "target_commitish" => "master",
  "name"             => release_name,
  "body"             => release_desc,
  "draft"            => false,
  "prerelease"       => false
}.to_json

response = http.request(request)
abort response.body unless response.is_a?(Net::HTTPSuccess)

release = JSON.parse(response.body)
puts release

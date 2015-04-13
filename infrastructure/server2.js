var redis = require('redis')
var express = require('express')
var app = express()
// REDIS
var client = redis.createClient(6379, '127.0.0.1', {})

///////////// WEB ROUTES

// Add hook to make it easier to get all visited URLS.
app.use(express.static("../www"));
app.use(express.static("../www" + '/css'));
app.get('/', function(req, res) {
  res.sendFile('index.html');
})

// HTTP SERVER
var server = app.listen(3002, function () {

  var host = server.address().address
  var port = server.address().port
	client.lpush("sitesList",3002)
  console.log('Example app listening at http://%s:%s', host, port)
})


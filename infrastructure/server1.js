var redis = require('redis')
var fs = require('fs')
var express = require('express')
var app = express()
// REDIS
var client = redis.createClient(6379, '127.0.0.1', {})

///////////// WEB ROUTES

// Add hook to make it easier to get all visited URLS.

app.get('/', function(req, res) {
  res.send('This is the Ordinary Server which has nothing.You have 1/3 chance get into the Canary Server!');
  
})


// HTTP SERVER
var server = app.listen(3001, function () {

  var host = server.address().address
  var port = server.address().port
client.lpush("sitesList",3001)
  console.log('Example app listening at http://%s:%s', host, port)
})


var redis = require('redis')
var express = require('express')
var app=express();
var chance=3;//1/chance enter into the canary
// REDIS
var client = redis.createClient(6379, '127.0.0.1', {})
///////////// WEB ROUTES

// Add hook to make it easier to get all visited URLS

function randomInt (low, high) {
    return Math.floor(Math.random() * (high - low) + low);
}
function proxy(req,res){
	var number=randomInt(1,100);
	console.log(number)
	if(number % chance ==0){
		client.lrange("sitesList",0,0,function(error,item){
			console.log(item)
			console.log("In Canary Server")
			res.redirect("http://localhost:"+item+req.url);
		});
	}
	else{
		client.lrange("sitesList",1,1,function(error,item){
			console.log(item)
			console.log("In Ordinary Server")
			res.redirect("http://localhost:"+item+req.url);
		});
	}
}
app.get('/', function(req, res) {
  	proxy(req,res)
});


// HTTP SERVER
var server = app.listen(3000, function () {
	client.del("sitesList");
  var host = server.address().address
  var port = server.address().port
  console.log('Example app listening at http://%s:%s', host, port);
})


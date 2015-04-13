var redis = require('redis')
var express = require('express')

var http = require('http')
var request = require('request')
var os = require('os')
var app=express();
var server = require('http').Server(app);
var io= require('socket.io')(server)
// REDIS
var client = redis.createClient(6379, '127.0.0.1', {})
app.use(express.static("../www"));
///////////// WEB ROUTES

// Add hook to make it easier to get all visited URLS
function memoryLoad()
{
	// console.log( os.totalmem(), os.freemem() );
	return ~~(100*(os.totalmem()-os.freemem())/os.totalmem());
};
function cpuTicksAcrossCores() 
{
  //Initialise sum of idle and time of cores and fetch CPU info
  var totalIdle = 0, totalTick = 0;
  var cpus = os.cpus();
 
  //Loop through CPU cores
  for(var i = 0, len = cpus.length; i < len; i++) 
  {
		//Select CPU core
		var cpu = cpus[i];
		//Total up the time in the cores tick
		for(type in cpu.times) 
		{
			totalTick += cpu.times[type];
		}     
		//Total up the idle time of the core
		totalIdle += cpu.times.idle;
  }
 
  //Return the average Idle and Tick times
  return {idle: totalIdle / cpus.length,  total: totalTick / cpus.length};
};
var startMeasure = cpuTicksAcrossCores();

function cpuAverage()
{
	var endMeasure = cpuTicksAcrossCores(); 
 
	//Calculate the difference in idle and total time between the measures
	var idleDifference = endMeasure.idle - startMeasure.idle;
	var totalDifference = endMeasure.total - startMeasure.total;
 
	//Calculate the average percentage CPU usage
	return ~~(100*(totalDifference-idleDifference)/totalDifference);
};
function measureLatenancy(server)
{
	var options = 
	{
		url: 'http://localhost' + ":" + server.address().port,
	};
	var startTime=Date.now();
	request(options, function (error, res, body) 
	{
		server.latency = Date.now()-startTime;
	});
	return server.latency;
};
function calcuateColor()
{
	// latency scores of all nodes, mapped to colors.
	var nodes = nodeServers.map( measureLatenancy ).map( function(latency) 
	{
		var color = "#cccccc";
		if( !latency )
			return {color: color};
		if( latency > 8000 )
		{
			color = "#ff0000";
		}
		else if( latency > 4000 )
		{
			color = "#cc0000";
		}
		else if( latency > 2000 )
		{
			color = "#ffff00";
		}
		else if( latency > 1000 )
		{
			color = "#cccc00";
		}
		else if( latency > 100 )
		{
			color = "#0000cc";
		}
		else
		{
			color = "#00ff00";
		}
		//console.log( latency );
		return {color: color};
	});
	//console.log( nodes );
	return nodes;
};
/// CHILDREN nodes
var nodeServers = [];

///////////////
//// Broadcast heartbeat over websockets
//////////////
setInterval( function () 
{
	io.sockets.emit('heartbeat', 
	{ 
        name: "Your Computer", cpu: cpuAverage(), memoryLoad: memoryLoad(),
        nodes: calcuateColor()
   });

}, 2000);

function randomInt (low, high) {
    return Math.floor(Math.random() * (high - low) + low);
}
function proxy(req,res){
	var number=randomInt(1,100);
	console.log(number)
	if(number % 3 ==0){
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
})

app.get('/monitor',function(req,res){
	res.sendFile('index.html');
})

// HTTP SERVER
server.listen(3000, function () {
	client.del("sitesList");
  var host = server.address().address
  var port = server.address().port
  console.log('Example app listening at http://%s:%s', host, port);
})


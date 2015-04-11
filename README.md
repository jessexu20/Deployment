Cache, Proxies, Queues
=========================
##Homework3(Option 2)
### Setup

* Clone this repo, run `npm install`.
* Install redis and run on localhost:6379
go to redis's directory and run
	src/redis-server

### A simple web server
I have created three servers on the local host, server which runs on port 3000 is acting as proxy and servers on port 3001 and port 3002 runs as normal servers.

	node proxy.js(port on 3000)
	node server1.js(port on 3001)
	node server2.js(port on 3002)

### Redis

You will be using [redis](http://redis.io/) to build some simple infrastructure components, using the [node-redis client](https://github.com/mranney/node_redis).

	var redis = require('redis')
	var client = redis.createClient(6379, '127.0.0.1', {})

In general, you can run all the redis commands in the following manner: client.CMD(args). For example:

	client.set("key", "value");
	client.get("key", function(err,value){ console.log(value)});

### An expiring cache

This function is implement on port 3001. Please visit the http://localhost:3000/get,http://localhost:3000/set to check the function and please watch the console output.

Create two routes, `/get` and `/set`.

When `/set` is visited, set a new key, with the value:
> "this message will self-destruct in 10 seconds".

Use the expire command to make sure this key will expire in 10 seconds.

When `/get` is visited, fetch that key, and send value back to the client: `res.send(value)` 


### Recent visited sites

This function is implement on port 3001. Please visit the http://localhost:3000/recent to check the function and please watch the console output and page. The page will show in the tuple the five recent url you visited.


### Cat picture uploads: queue

This function is implement on port 3000,3001,3002. 

Before visiting the page, you should start the server and upload a picture using the following command.
	
	curl -F "image=@./img/morning.jpg" localhost:3000/upload

Please visit the http://localhost:3000/meow to check the result and please notice since I have implemented proxy on it, it will redirect you to http://localhost:3001/meow or http://localhost:3002/meow. It will display the most recent image to the client and *remove* the image from the queue.

### Proxy server

If you visit the http://localhost:3000, you will notice that everytime you visit it, you will have a different url which is either on port 3001 or on port 3002. The server will automatically direct you to either of the sites.
# Deployment

MileStone 3
=========================
##MileStone Deploy

The IP address of our aws server is 
	
Production Server:	http://52.11.31.114:3000/

Develop Server: 	http://52.0.146.229:3000/
	
### Docker Configuration
We have used docker to work as our container so that we only to pull the container from the dockerHub or build a local container using the following dockerfile.

####Development Container
The following is the dockerfile in development, which needs more dependency than the production one.

	FROM ubuntu:14.04
	MAINTAINER Jesse Xu, sxu11@ncsu.edu

	RUN apt-get update
	RUN apt-get -y install git
	RUN apt-get -y install nodejs
	RUN apt-get -y install npm
	RUN apt-get -y install tcl wget
	RUN apt-get -y install vim
	RUN apt-get -y install nodejs-legacy
	RUN wget http://download.redis.io/releases/redis-3.0.0.tar.gz
	RUN tar xzf redis-3.0.0.tar.gz
	WORKDIR redis-3.0.0
	RUN make
	RUN make test
	WORKDIR /
	RUN git clone https://github.com/jessexu20/deployment
	WORKDIR deployment/infrastructure 
	RUN pwd
	RUN npm install
	WORKDIR /
	WORKDIR deployment/source
	RUN npm install
	RUN npm install -g bower
	RUN npm install -g grunt
	RUN npm install -g grunt-cli
	RUN bower install --allow-root
	RUN grunt less
	EXPOSE 6379
	EXPOSE 3000-3002

In order to let the server communicate to the outside world, you have to expose the port in docker container.


####Production Container
Similar dockerfile with less dependency as follows.

	FROM ubuntu:14.04
	MAINTAINER Jesse Xu, sxu11@ncsu.edu

	RUN apt-get update
	RUN apt-get -y install git
	RUN apt-get -y install nodejs
	RUN apt-get -y install npm
	RUN apt-get -y install tcl wget
	RUN apt-get -y install vim
	RUN apt-get -y install nodejs-legacy
	RUN wget http://download.redis.io/releases/redis-3.0.0.tar.gz
	RUN tar xzf redis-3.0.0.tar.gz
	WORKDIR redis-3.0.0
	RUN make
	RUN make test
	WORKDIR /
	EXPOSE 6379
	EXPOSE 3000-3002

### Grunt
We have used grunt to build the source to an bootstrap css file. Therefore, in the development container, we need to install grunt, grunt-cli, bower several tools to build the css file and output into the www folder. The project is a [former 510 project example](https://github.ncsu.edu/sxu11/MiniProject1-Template) given by Chris Parnin. We use it so that we can have built result in our project.
If you want to build the css yourself, in the folder source, run grunt less. As indicate by the gruntfile.js.

	module.exports = function(grunt) {

	  grunt.initConfig({

		  less: 
		  {
		      development: 
		      {
		        options: 
		        {
		          compress: true,
		          yuicompress: true,
		          optimization: 2
		        },
		        files: 
		        [{
		  				expand: true,
		  				cwd: "bower_components/bootstrap/less",
		  				src: "**/bootstrap.less",
		  				dest: "../www/css/",
		  				ext: ".css"
		        }]
		      }
		  }

	  });

	  // This will automatically load any grunt plugin you install, such as grunt-contrib-less.
	  require('load-grunt-tasks')(grunt);

	};

	
####Publish/Get a release
We have wrote a script to push a release, you only need to run the following to publish a release. The release will only contain the infrastructure and the www folder which is the webpage and leave alone the source code for building the css.

We have published a release at the repo release page.
	
And in order to get a release in the production server, you need to download the release at the production server and then untar it.
You will get two folders which is /infrastructure and /www. The files under the infrastructure folder is the node code which is used to start the server. And www folder only contains the web page and the built css.

	wget https://github.com/jessexu20/Deployment/releases/download/v2/release.tar
	tar xvf release.tar

### Infrastructure

After correctly build the docker container locally, we have used the saltstack to install the docker on two instances on AWS. On the development instance, we pull the develop container by running
	
	sudo docker pull jessexu20/deployment2
	
On the production machine, we pull the production container by running 
	
	sudo docker pull jessexu20/deployment:production
	
When the docker images have been pulled from the dockerhub, we need to run the container for redis and server. The "-d" tag is to ask the container running in background and "-p" tag is for port mapping. Here, we still use the port 6379 for redis server. For the server, we use the port 3000,3001 and 3002. 
	
	sudo docker run -d -p 6379:6379 /redis-3.0.0/src/redis-server
	sudo docker run -d -p 3000-3002:3000-3002 /deployment

### Canary Release

We have deployed the normal server on port 3001, while canary server on port 3002. Port 3000 serves as a proxy server, which will direct the access to 3001 and 3002. We have set up a chance variable to regulate the routing. By default, the chance to get into the canary server is 1/3, which means you have 1/3 possibility to get into the canary server.


### Canary Monitor

We have implemented the monitor mechanism in the workshop. Therefore, the cpu and memory information will be recorded by the socket.io and forward it into the webpage. We also add alerts and faults column into the webpage. 

* When the cpu usage is over 20% or the spare memory is less than 70%, it will trigger the **alert** and the alerts number on the monitor page will increase. 
* When the cpu usage is over 50% or the spare memory is less than 50%, it will trigger the **fault** and the alerts number on the monitor page will increase. Also, we have implemented a route in the canary server. If you visit the route "/error", it will trigger the fault value to increase by 1.

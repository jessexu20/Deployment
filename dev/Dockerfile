FROM ubuntu:14.04
MAINTAINER Jesse Xu, sxu11@ncsu.edu

RUN apt-get update
RUN apt-get -y install git
RUN apt-get -y install nodejs
RUN apt-get -y install npm
RUN apt-get -y install tcl wget
RUN wget http://download.redis.io/releases/redis-3.0.0.tar.gz
RUN tar xzf redis-3.0.0.tar.gz
WORKDIR redis-3.0.0
RUN make
RUN make test
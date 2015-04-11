FROM ubuntu:14.04
MAINTAINER Jesse Xu, sxu11@ncsu.edu

RUN apt-get update
RUN apt-get -y install git
RUN apt-get -y install nodejs
RUN apt-get -y install npm
RUN apt-get install make gcc tcl
RUN cd deps/ 
RUN make hiredis lua jemalloc linenoise  
RUN make
RUN make test
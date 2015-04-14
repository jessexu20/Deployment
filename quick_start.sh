sudo docker pull jessexu20/deployment
sudo docker run -d -p 6379:6379 jessexu20/deployment /redis-3.0.0/src/redis-server
sudo docker run -d -p 3000:3000 jessexu20/deployment nodejs /deployment/main.js
sudo docker run -d -p 3001:3001 jessexu20/deployment nodejs /deployment/server1.js
sudo docker run -d -p 3002:3002 jessexu20/deployment nodejs /deployment/server2.js
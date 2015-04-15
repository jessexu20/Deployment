sudo docker run -d -p 6379:6379 jessexu20/deployment2 /redis-3.0.0/src/redis-server
sudo docker run -d -p 3000-3002:3000-3002 jessexu20/deployment2 nodejs /deployment/main.js
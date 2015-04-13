sudo apt-get update
sudo apt-get -y install git
sudo apt-get -y install nodejs
sudo apt-get -y install npm
sudo apt-get -y install tcl wget
sudo apt-get -y install vim
wget http://download.redis.io/releases/redis-3.0.0.tar.gz
tar xzf redis-3.0.0.tar.gz
cd redis-3.0.0
make
make test
cd ..
git clone https://github.com/jessexu20/deployment
cd deployment
npm install
tar cvf release.tar infrastructure/ www/

git add .

git commit -m "test"

git tag -a $1 -m "message"

git push origin $1

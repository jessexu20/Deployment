tar cvf release.tar infrastructure/ www/ get_release.sh

git add release.tar

git commit -m "add release"

git tag -a $1 -m "release"

git push origin $1

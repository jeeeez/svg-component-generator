set -e

rm -rf dist
mkdir dist

cp -r src dist/
cp package.json dist/
cp README.md dist/


npm publish dist

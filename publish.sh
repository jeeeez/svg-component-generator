set -e

rm -rf dist
mkdir dist

cp -r src dist/
cp package.json dist/
cp README.md dist/


npm publish dist

# cnpm sync svg-component-generator
curl -X PUT https://npm.taobao.org/sync/svg-component-generator

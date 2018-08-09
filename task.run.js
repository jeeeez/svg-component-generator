const { run } = require('./src/index');
const { resolvePath} = require('./src/utils');

const sourceDir = resolvePath(__dirname, './svgs');
const outputDir = resolvePath(__dirname, './dist/react');

run(sourceDir, outputDir);

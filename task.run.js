const { run } = require('./src/index');
const { resolvePath } = require('./src/utils');

const sourceDir = resolvePath(__dirname, './svgs');
const outputDir = resolvePath(__dirname, './components/react');

run(sourceDir, outputDir);

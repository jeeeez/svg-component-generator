const path = require('path');
const { writeFile, readFile } = require('./utils');


function resolvePath(url) {
    return path.resolve(__dirname, url)
}


async function genSvgIconComponentType({
    componentName,
    outputPath
}) {
    const svgIconCode = await readFile(resolvePath('./interface.ts'));

    const componentCode = svgIconCode.replace('ComponentName', componentName);

    writeFile(outputPath, componentCode);
}


module.exports = genSvgIconComponentType;

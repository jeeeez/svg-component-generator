const path = require('path');
const { parse } = require('babylon');
const traverse = require('babel-traverse').default;
const generator = require('babel-generator').default;
const { writeFile, readFile } = require('./utils');
const { sanitize } = require('./svg-sanitize');
const { convertToJs } = require('./convert-to-js');


function resolvePath(url) {
    return path.resolve(__dirname, url)
}


async function genSvgHtml(src) {
    const html = await readFile(src);

    return sanitize(html).replace(/\<svg/, '<svg {...props} style={styles}');
}


async function genSvgIconComponent({
    iconPath,
    componentName,
    outputPath,
    esOutputPath
}) {
    const html = await genSvgHtml(iconPath);

    const svgIconCode = await readFile(resolvePath('./template.js'));
    const ast = parse(svgIconCode, {
        sourceType: 'module'
    });


    traverse(ast, {
        enter(path) {
            const { node } = path;
            if (node.type === 'Identifier') {
                if (node.name === 'ComponentName') {
                    node.name = componentName;
                } else if (node.name === 'SVGHTLM') {
                    node.name = `(
    ${html}
  )`;
                }
            }
        }
    });


    const jsxComponentCode = generator(ast).code;

    writeFile(esOutputPath, jsxComponentCode);

    const jsComponentCode = convertToJs(jsxComponentCode);
    writeFile(outputPath, jsComponentCode);
}


module.exports = genSvgIconComponent;

const { parse } = require('babylon');
const traverse = require('babel-traverse').default;
const generator = require('babel-generator').default;
const path = require('path');
const { writeFile, readFile } = require('./utils');

// const htmlparser = require("htmlparser2");

// const svgParse = new htmlparser.Parser({
//     onopentag(name, attrs) {
//         if (name === 'svg') {
//             console.log(attrs);
//             attrs.style = 'styles';
//         }
//     }
// });

function resolvePath(url) {
    return path.resolve(__dirname, url)
}


async function genSvgHtml(src) {
    const html = await readFile(src);

    const svgHTML = html.replace(/\<svg/, '<svg {...props} style={styles}');
    return svgHTML.match(/(\<svg.*\<\/svg\>)/g)[0];
}


async function genSvgIconComponent({
    iconPath,
    componentName,
    outputPath
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


    const componentCode = generator(ast).code;

    writeFile(outputPath, componentCode);
}


module.exports = genSvgIconComponent;

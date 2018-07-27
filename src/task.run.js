const fs = require('fs');
const path = require('path');
const genSvgIconComponent = require('./generator');
const { resolvePath, removeDir, createDir, readDir } = require('./utils');


const dir = resolvePath(__dirname, './svgs');
const outputDir = resolvePath(__dirname, '../dist/react');

async function run() {
    await removeDir(outputDir);
    await runDirTask(dir, outputDir);
}

run();


async function runDirTask(sourceDir, outputDir) {
    await createDir(outputDir);

    const files = await readDir(sourceDir);

    return Promise.all(files.map(({ stat, filePath, filename }) => {
        if (stat.isFile()) {
            if (filename.indexOf('.svg') > -1) {
                const componentName = parseComponentName(filename);
                genSvgIconComponent({
                    componentName,
                    iconPath: filePath,
                    outputPath: `${outputDir}/${componentName}.jsx`
                });
            }
        } else {
            return runDirTask(resolvePath(sourceDir, filename), resolvePath(outputDir, filename));
        }
    }));
}


function parseComponentName(filename) {
    filename = filename.replace('.svg', '');
    return filename.replace(/\-(\w)/g, (all, w) => {
        return w.toUpperCase();
    }).replace(/(^\w)/, (all, w) => {
        return w.toUpperCase();
    }).replace(/\-/g, '');
}

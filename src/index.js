const genSvgIconComponent = require('./generator');
const { resolvePath, removeDir, createDir, readDir } = require('./utils');


async function runDirTask(sourceDir, outputDir, suffix) {
    await createDir(outputDir);

    const files = await readDir(sourceDir);

    return Promise.all(files.map(({ stat, filePath, filename }) => {
        if (stat.isFile()) {
            if (filename.indexOf('.svg') > -1) {
                const componentName = parseComponentName(filename);

                genSvgIconComponent({
                    componentName,
                    iconPath: filePath,
                    outputPath: `${outputDir}/${componentName}.${suffix}`
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


exports.run = async function run(sourceDir, outputDir, suffix = 'jsx') {
    await removeDir(outputDir);
    await runDirTask(sourceDir, outputDir, suffix);
}

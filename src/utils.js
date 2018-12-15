const fs = require('fs');
const mkdirp = require('mkdirp');

function resolvePath(...props) {
    return require('path').resolve(...props);
}

exports.resolvePath = resolvePath;

async function writeFile(src, content) {
    const exists = await fs.exists(src, err => {
        if (err) throw err;
    });

    if (!exists) {
        await fs.createWriteStream(src, err => {
            if (err) throw err;
        });
    }

    await fs.writeFile(src, content, err => {
        if (err) throw err;
    });
}
exports.writeFile = writeFile;

async function readFile(src) {
    return new Promise((resolve, reject) => {
        fs.readFile(src, (err, stdout) => {
            if (err) return reject(err);

            resolve(stdout.toString());
            // return stdout.toString();
        });
    });
}
exports.readFile = readFile;


async function createDir(dir) {
    return new Promise(async (resolve) => {
        mkdirp(dir, err => {
            if (err) throw err;

            resolve();
        });
    });
}
exports.createDir = createDir;


async function readDir(dir) {
    return new Promise((resolve, reject) => {
        fs.readdir(dir, (err, files) => {
            if (err) throw err;

            return Promise.all(files.map(async function(filename) {
                const filePath = resolvePath(dir, filename);
                const stat = await getStat(filePath);

                return { stat, filePath, filename };
            })).then(resolve);
        });
    });
}

exports.readDir = readDir;

async function removeDir(dir) {
    return new Promise(async (resolve, reject) => {
        if (!fs.existsSync(dir)) return resolve();

        const mappings = await readDir(dir);

        await Promise.all(mappings.map(({ stat, filePath }) => {

            if (stat.isFile()) {
                return removeFile(filePath);
            }
            if (stat.isDirectory()) {
                return removeDir(filePath);
            }
        }));

        fs.rmdir(dir, err => {
            if (err) throw err;

            resolve();
        });
    });
}
exports.removeDir = removeDir;

async function getStat(uri) {
    return new Promise((resolve, reject) => {
        fs.stat(uri, (err, stats) => {
            if (err) throw err;

            resolve(stats);
        });
    });
}
exports.getStat = getStat;

async function removeFile(path) {
    return new Promise((resolve, reject) => {
        fs.unlink(path, err => {
            if (err) throw err;

            resolve();
        });
    });
}
exports.removeFile = removeFile;

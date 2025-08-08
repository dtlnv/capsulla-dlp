const fs = require('fs');
const archiver = require('archiver');

const folderPath = __dirname + '/build';
const zipFileName = 'capsulla.zip';

const output = fs.createWriteStream(zipFileName);

const archive = archiver('zip', {
    zlib: { level: 9 }, // Compression level (0-9)
});

archive.on('warning', function (err) {
    if (err.code === 'ENOENT') {
        console.warn(err);
    } else {
        throw err;
    }
});

archive.on('error', function (err) {
    throw err;
});

archive.pipe(output);

archive.directory(folderPath, false);

archive.finalize();

console.log('Zip file created: ' + zipFileName);

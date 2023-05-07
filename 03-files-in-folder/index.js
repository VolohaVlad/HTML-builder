const path = require('path');
const promises = require('fs/promises');
const process = require('process');
const { stdout } = process;

const filePath = path.join(__dirname, '/secret-folder');

promises.readdir(filePath, { withFileTypes: true }).then((files) => {
  files.forEach((file) => {
    if (file.isFile()) {
      const pathFile = path.join(filePath, file.name);
      const extNameFile = path.extname(pathFile);
      const baseNameFile = path.basename(pathFile, extNameFile);

      promises.stat(pathFile).then((file) => {
        const fileSize = file.size / 1024;
        stdout.write(`${baseNameFile} - ${extNameFile.slice(1)} - ${fileSize}kb\n`);
      });
    }
  });
});

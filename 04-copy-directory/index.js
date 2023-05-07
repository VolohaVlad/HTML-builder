const promises = require('fs/promises');
const path = require('path');
const process = require('process');
const { stdout } = process;

const sourcePath = path.join(__dirname, 'files');
const destinationPath = path.join(__dirname, 'files-copy');

promises
  .rm(destinationPath, { recursive: true, force: true })
  .then(() => promises.mkdir(destinationPath, { recursive: true }))
  .then(() => promises.readdir(sourcePath))
  .then((files) => {
    files.forEach((file) => {
      promises.copyFile(`${sourcePath}/${file}`, `${destinationPath}/${file}`);
      stdout.write(`${destinationPath}${file}\n`);
    });
  })
  .catch(function (error) {
    stdout.write(error);
  });

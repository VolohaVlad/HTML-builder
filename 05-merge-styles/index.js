const promises = require('fs/promises');
const path = require('path');
const fs = require('fs');
const process = require('process');
const { stdout } = process;

const sourcePath = path.join(__dirname, 'styles');
const destinationPath = path.join(__dirname, 'project-dist/bundle.css');

promises
  .rm(destinationPath, { recursive: true, force: true })
  .then(() => promises.readdir(sourcePath))
  .then((files) =>
    files.filter((file) => path.extname(path.join(sourcePath, file)) === '.css')
  )
  .then((files) =>
    Promise.all(
      files.map((file) =>
        promises.readFile(path.join(sourcePath, file), 'utf-8')
      )
    )
  )
  .then((files) => {
    const output = fs.createWriteStream(destinationPath, { flags: 'w' });
    files.forEach((fileData) => output.write(`${fileData}\n`));
  })
  .catch(function (error) {
    stdout.write(error);
  });

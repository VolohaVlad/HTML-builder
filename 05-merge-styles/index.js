const promises = require('fs/promises');
const path = require('path');
const fs = require('fs');
const process = require('process');
const { stdout } = process;

const sourcePath = path.join(__dirname, 'styles');
const destinationPath = path.join(__dirname, 'project-dist/bundle.css');

const createBundle = async () => {
  try {
    await promises.rm(destinationPath, { recursive: true, force: true });
    const output = fs.createWriteStream(destinationPath, { flags: 'w' });

    const filesFromFolder = await promises.readdir(sourcePath, { withFileTypes: true });
    const cssFiles = filesFromFolder.filter((file) => file.isFile() && path.extname(path.join(sourcePath, file.name)) === '.css');
    const cssFileNames = cssFiles.map(file_1 => file_1.name);
    const buffer = await Promise.all(cssFileNames.map((file_2) => promises.readFile(path.join(sourcePath, file_2), 'utf-8')));
    buffer.forEach((fileData) => output.write(`${fileData}\n`));
  } catch (error) {
    stdout.write(error);
  }
}

Promise.all([createBundle()]);

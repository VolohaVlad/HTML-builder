const promises = require('fs/promises');
const path = require('path');
const process = require('process');
const { stdout } = process;

const sourcePath = path.join(__dirname, 'files');
const destinationPath = path.join(__dirname, 'files-copy');

const copyDirectory = async function (sourcePath, destinationPath) {
  try {
    await promises.rm(destinationPath, { recursive: true, force: true });
    await promises.mkdir(destinationPath, { recursive: true });
    const files = await promises.readdir(sourcePath, { withFileTypes: true });
    files.forEach(async (file) => {
      if(file.isFile()) {
        promises.copyFile(`${sourcePath}/${file.name}`, `${destinationPath}/${file.name}`);
        stdout.write(`${destinationPath}${file.name}\n`);
      }
      if (file.isDirectory()) {
        const dirSourcePath = path.join(sourcePath, file.name);
        const dirDestinationPath = path.join(destinationPath, file.name);
        await copyDirectory(dirSourcePath, dirDestinationPath);
      }
    });
  } catch (error) {
    stdout.write(error);
  }
}

Promise.all([copyDirectory(sourcePath, destinationPath)]);

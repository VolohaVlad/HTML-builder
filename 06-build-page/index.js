const promises = require('fs/promises');
const path = require('path');
const fs = require('fs');
const process = require('process');
const { stdout } = process;

const sourceStylesPath = path.join(__dirname, 'styles');
const sourceAssetsPath = path.join(__dirname, 'assets');
const destinationPath = path.join(__dirname, 'project-dist');
const styleDestinationPath = path.join(destinationPath, 'style.css');
const assetsDestinationPath = path.join(destinationPath, 'assets');
const indexPath = path.join(destinationPath, 'index.html');

const createCssBundle = async () => {
  try {
    await promises.rm(styleDestinationPath, { recursive: true, force: true });
    const buffer = await promises.readdir(sourceStylesPath);
    const cssFiles = buffer.filter(
      (file) => path.extname(path.join(sourceStylesPath, file)) === '.css'
    );
    const files = await Promise.all(
      cssFiles.map((file) =>
        promises.readFile(path.join(sourceStylesPath, file), 'utf-8')
      )
    );
    const output = fs.createWriteStream(styleDestinationPath, { flags: 'w' });
    files.forEach((fileData) => output.write(`${fileData}\n`));
  } catch (error) {
    stdout.write(error);
  }
};

const copyAssets = async function (sourcePath, destinationPath) {
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
        await copyAssets(dirSourcePath, dirDestinationPath);
      }
    });
  } catch (error) {
    stdout.write(error);
  }
};

const htmlBuilder = async () => {
  try {
    await promises.rm(indexPath, { force: true });
    const sourceComponents = path.join(__dirname, 'components');
    const componentFileNames = await promises.readdir(sourceComponents);
    const filesData = await Promise.all(
      componentFileNames.map((file) => promises.readFile(path.join(sourceComponents, file), 'utf-8'))
    );
    const componentTemplate = componentFileNames.map((file) => `{{${path.basename(file, '.html')}}}`);
    let template = await promises.readFile(path.join(__dirname, 'template.html'), 'utf-8');
    componentTemplate.forEach((file, index) => {
      template = template.replace(file, filesData[index]);
    });
    fs.createWriteStream(indexPath).write(template);
  } catch (error) {
    stdout.write(error);
  }
};

promises
  .mkdir(destinationPath, { recursive: true })
  .then(Promise.all([createCssBundle(), copyAssets(sourceAssetsPath, assetsDestinationPath), htmlBuilder()]));

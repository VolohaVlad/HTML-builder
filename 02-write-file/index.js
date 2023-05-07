const fs = require('fs');
const path = require('path');
const process = require('process');
const { stdin, stdout, exit } = process;

const filePath = path.join(__dirname, 'text.txt');
const stream = fs.createWriteStream(filePath, 'utf-8');

stdout.write('Write your message in console\n');

const stopWriting = () => {
  console.log('exit');
  exit();
};

stdin.on('data', (line) => {
  const data = Buffer.from(line).toString().trim();

  if (data === 'exit') {
    stopWriting();
  }

  stream.write(`${data}\n`);
});

process.on('SIGINT', () => {
  stopWriting();
});

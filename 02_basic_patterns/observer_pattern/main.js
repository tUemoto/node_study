const { EventEmitter } = require('events');
const fs = require('fs');

function findPattern(files, regex) {
  const emitter = new EventEmitter();
  files.forEach((file) => {
    fs.readFile(file, 'utf8', (err, content) => {
      if (err) {
        return emitter.emit('error', err);
      }
      emitter.emit('fileread', file);
      const match = content.match(regex);
      if (match) {
        match.forEach((elem) => {
          emitter.emit('found', file, elem);
        });
      }
    });
  });
  console.log(emitter);
  return emitter;
}

findPattern(
  ['fileA.txt', 'fileB.json'],
  /hello \w+/g,
).on('fileread', (file) => {
  console.log(`${file} was read`);
}).on('found', (file, match) => {
  console.log(`Matched ${match} in file ${file}`);
}).on('error', (err) => {
  console.log('Error emitted: ', err.message);
});

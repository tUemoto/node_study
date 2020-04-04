const { EventEmitter } = require('events');
const fs = require('fs');

class FindPattern extends EventEmitter {
  constructor(regex) {
    super();
    this.regex = regex;
    this.files = [];
  }

  addFile(file) {
    this.files.push(file);
    return this;
  }

  find() {
    this.files.forEach((file) => {
      fs.readFile(file, 'utf8', (err, content) => {
        if (err) {
          return this.emit('error', err);
        }
        this.emit('fileread', file);

        const match = content.match(this.regex);
        if (match) {
          match.forEach((elem) => {
            this.emit('found', file, elem);
          });
        }
      });
    });
    return this;
  }
}

const findPatternObject = new FindPattern(/hello \w+/);

console.log(findPatternObject
  .addFile('fileA.txt')
  .addFile('fileB.json'));
findPatternObject
  .find()
  .on('found', (file, match) => { console.log(`Matched "${match}" in file ${file}`); })
  .on('error', (err) => { console.log('Error emitted: ', err.message); });

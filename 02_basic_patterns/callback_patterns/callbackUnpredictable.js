const fs = require('fs');

const cache = {};

/**
 * 同期CPSと非同期CPSの混在
 * @param  {String}   filename [description]
 * @param  {Function} callback [description]
 * @return {[type]}            [description]
 */
const inconsistentRead = (filename, callback) => {
  if (cache[filename]) {
    callback(cache[filename]);
  } else {
    fs.readFile(filename, 'utf-8', (err, data) => {
      cache[filename] = data;
      callback(data);
    });
  }
};

const createFileReader = (filename) => {
  const listeners = [];
  inconsistentRead(filename, (value) => {
    listeners.forEach(listener => listener(value));
  });

  return {
    onDataReady: (listener) => {
      console.log('listener: ', listener);
      listeners.push(listener);
    },
  };
};

const reader1 = createFileReader('data.txt');
reader1.onDataReady((data) => {
  console.log('First call data: ', data);
  const reader2 = createFileReader('data.txt');
  reader2.onDataReady((data2) => {
    console.log('Second call data: ', data2);
  });
});

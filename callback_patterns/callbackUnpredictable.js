const fs = require('fs');

const cache = {};

/**
 * 同期CPSと非同期CPSの混在
 * cacheが存在するなら同期関数として働き
 * cacheが存在しないなら非同期関数として働く
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
  // reader1はcacheなしの状態でinconsistentReadが呼ばれるので、
  // callback関数の実行は非同期で行われる
  // そのためreader1.onDataReadyの実行よりも後にcallbackが実行され、
  // 結果としてデータが取得できる。
  console.log('First call data: ', data);
  const reader2 = createFileReader('data.txt');
  reader2.onDataReady((data2) => {
    // 一方でreader2の時は、cacheにすでに`data.txt`が登録されているため、
    // 即座にcallback関数が実行される。
    // そのため、onDataReadyでは何も行われない
    console.log('Second call data: ', data2);
  });
});

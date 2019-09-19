const fs = require('fs');

const cache = {};

/**
 * cacheからの読み込みもfsからの読み込みも全て非同期で行う
 * caceheから取得する時に呼び出すprocess.nextTickは、
 * process.nextTickが再帰的に呼び出される場合I/O Starvationを引き起こすことに注意
 * 似たような関数にsetImmediateも存在
 * 詳しくは[「for やめろ」またはイベントループと nextTick()](http://jxck.hatenablog.com/entry/for-with-eventloop)を参照
 * @param  {[type]}   filename [description]
 * @param  {Function} callback [description]
 * @return {[type]}            [description]
 */
function consitentReadAsync(filename, callback) {
  if (cache[filename]) {
    process.nextTick(() => callback(cache[filename]));
  } else {
    fs.readFile(filename, 'utf8', (err, data) => {
      cache[filename] = data;
      callback(data);
    });
  }
}

async function test() {
  await consitentReadAsync('data.txt', (data) => {
    console.log('1回目');
    console.log(data);
  });
  await consitentReadAsync('data.txt', (data) => {
    console.log('2回目');
    console.log(data);
  });
}

test();

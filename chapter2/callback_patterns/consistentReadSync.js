const fs = require('fs');

const cache = {};

/**
 * fs.readFileを同期で実行するreadFileSync関数を利用して
 * 全ての処理が同期的に実行されるようにする
 * ダイレクトスタイル(DS)で実装
 *  -> return で処理結果を返却する
 *  -> 同期的なAPIはDSで実装した方が単純でわかりやすい
 * @param  {[type]} filename [description]
 * @return {[type]}          [description]
 */
function consitentReadSync(filename) {
  if (cache[filename]) {
    return cache[filename];
  }
  cache[filename] = fs.readFileSync(filename, 'utf8');
  return cache[filename];
}

console.log(consitentReadSync('data.txt'));
console.log(consitentReadSync('data.txt'));

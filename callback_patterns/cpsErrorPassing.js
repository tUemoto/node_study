const fs = require('fs');

/**
 * [readJSON description]
 * JSONファイルを読み込む
 * parseしたJSONを返却する時にtry-catchで囲むことで、
 * 例外をキャッチしてCPSを維持できる。
 * @param  {[type]}   filename [description]
 * @param  {Function} callback [description]
 * @return {[type]}            [description]
 */
const readJSON = (filename, callback) => {
  fs.readFile(filename, 'utf8', (err, data) => {
    let parsed;
    if (err) {
      return callback(err);
    }

    try {
      parsed = JSON.parse(data);
    } catch (e) {
      return callback(e);
    }
    return callback(null, parsed);
  });
};

/**
 * [readJSONThrows description]
 * JSONファイルを読み込む
 * JSON.parseがtry-catchで囲まれていないので、
 * 例外が発生した場合、例外がイベントループまで伝播し、
 * 後続の処理が中断される
 * @param  {[type]}   filename [description]
 * @param  {Function} callback [description]
 * @return {[type]}            [description]
 */
const readJSONThrows = (filename, callback) => {
  fs.readFile(filename, 'utf8', (err, data) => {
    if (err) {
      return callback(err);
    }

    return callback(null, JSON.parse(data));
  });
};

readJSON('data.txt', (err, json) => {
  if (err) {
    console.log('ちゃんとキャッチできてる at readJSON:', err);
  } else {
    console.log(json);
  }
});

readJSONThrows('data.txt', (err, json) => {
  if (err) {
    console.log('ちゃんとキャッチできてる at readJSONThrows: ', err);
  } else {
    console.log(json);
  }
});

process.on('uncaughtException', (err) => {
  // 例外がイベントループに到達し処理が中断されるよりも前に、
  // クリーンアップやログ出力の機会が与えられている
  // uncaughtExceptionを捕捉した時は、アプリケーションの状態が正しいとは限らない
  // そのため、終了処理(process.exit(1))を行うべき
  console.log('これでエラーをキャッチできる: ', err.message);
  process.exit(1);
});

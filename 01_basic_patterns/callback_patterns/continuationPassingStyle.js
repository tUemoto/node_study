/**
 * 継続渡しスタイル(Continuation-Passing Style: CPS)
 * 結果を伝播させる手法の一つ
 *
 */

/**
 * 同期CPS
 * @param {Number}   a        [description]
 * @param {Number}   b        [description]
 * @param {Function} callback [description]
 */
const add = (a, b, callback) => {
  callback(a + b);
};

console.log('before');

add(1, 2, (result) => {
  console.log(`Result: ${result}`);
});

console.log('after');

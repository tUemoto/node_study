/**
 * 非同期CPS
 * @param {Number}   a        [description]
 * @param {Number}   b        [description]
 * @param {Function} callback [description]
 */
const addAsync = (a, b, callback) => {
  setTimeout(() => callback(a + b), 100);
};


console.log('before');

addAsync(1, 2, result => console.log(`Result: ${result}`));

console.log('after');

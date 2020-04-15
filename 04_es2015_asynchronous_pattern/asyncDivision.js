module.exports = function asyncDivision(dividend, diviser, callback) {
  return new Promise((resolve, reject) => {
    process.nextTick(() => {
      const result = dividend / diviser;
      if (isNaN(result) || !Number.isFinite(result)) {
        const error = new Error('Invalid operands');
        if (callback) {
          callback(error);
        }
        reject(error);
      }
      if (callback) {
        callback(null, result);
      }
      resolve(result);
    });
  });
};

const asyncDivision = require('./asyncDivision');

asyncDivision(3, 5, (err, result) => {
  if (err) {
    console.log('callback error');
    return err;
  }
  return console.log(result);
});

asyncDivision(6, 1)
  .then((res) => {
    console.log(`promise result: ${res}`);
  })
  .catch((err) => {
    console.log(err);
  });

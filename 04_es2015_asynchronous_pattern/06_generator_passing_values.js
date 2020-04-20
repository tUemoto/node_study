function* twoWayGenerator() {
  const what = yield null;
  console.log(`Hello ${what}`);
}

const twoWay = twoWayGenerator();
twoWay.next();
twoWay.throw(new Error());
// twoWay.next('testtest');



const moduleB = require('./moduleB');

module.exports = {
  run: () => {
    console.log('moduleA is loaded');
    moduleB.log();
  },
};

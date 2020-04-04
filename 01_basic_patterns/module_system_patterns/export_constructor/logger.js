class Logger {
  constructor(name) {
    console.log('this: ', this);
    if (!new.target) {
      // if (!(this instanceof Logger))と等価
      // new.targetはメタプロパティ。
      return new Logger(name);
    }
    this.count = 0;
    this.name = name;
  }

  log(message) {
    this.count += 1;
    console.log(`[${this.name}]: ${message}`);
  }

  info(message) {
    console.log(`(概要)[${this.name}]: ${message}`);
  }

  verbose(message) {
    console.log(`(詳細)[${this.name}]: ${message}`);
  }
}


module.exports = Logger;

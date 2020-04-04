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
    console.log(`[${this.name}](${this.count}): ${message}`);
  }
}


module.exports = new Logger('DEFAULT');

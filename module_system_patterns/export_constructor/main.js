const Logger = require('./logger');

const dbLogger = new Logger('DB');
dbLogger.verbose('hogehoge');
dbLogger.info('fugafuga');

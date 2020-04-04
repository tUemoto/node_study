const logger = require('./logger_export_instance');
const logger2 = require('./logger_export_instance');

// 次の呼び出しは
// [DEFAULT](1): this is an informational message
// を返却する。
logger.log('this is an informational message');
// 次の呼び出しは
// [DEFAULT](2): this is additional logger
// を返却する。
logger2.log('this is additional logger');

// 複数回requireしてもキャッシュされているので、同じインスタンスが返却される
// 同じモジュールでversionが違う場合など、必ずしも上記の通りには行かないため要注意

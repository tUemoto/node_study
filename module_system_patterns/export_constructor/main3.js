// patcherは内部でlogger_export_instanceをrequireして、
// そのprototypeを変更している(exportはしていない)。
// 同じモジュールをrequireした時、キャッシュされているモジュールを返却しようとする性質を使って
// ここで使用しているlogger_export_instanceモジュールを書き換えている。
// これを俗にモンキーパッチと言い、あまり推奨されないものの現実では多用されている
require('./patcher');
const logger = require('./logger_export_instance');


logger.log('次にパッチした結果が出力されます。');
logger.customMessage();

const fs = require('fs');

/**
 * [loadModule description]
 * 自作のモジュールローダー
 * 勉強用のため便宜的な実装
 * evalはセキュリティ上の問題があるので可能な限り使用を避けること
 * @param  {[type]} filename [description]
 * @param  {[type]} module   [description]
 * @param  {[type]} require  [description]
 * @return {[type]}          [description]
 */
const loadModule = (filename, module, require) => {
  const wrappedSrc = `(function(module, exports, require) {
    ${fs.reqdFileSync(filename, 'utf8')}
  })(module, module.exports, require)`;
  eval(wrappedSrc);
};

const requireMine = (moduleName) => {
  console.log(`RequireMine invoked for module: ${moduleName}`);
  const id = requireMine.resolve(moduleName);
  if (requireMine.cache[id]) {
    return requireMine.cache[id].exports;
  }

  // モジュールのメタデータ
  const module = {
    exports: {},
    id,
  };
  // キャッシュの更新
  requireMine.cache[id] = module;

  // モジュールをロード
  loadModule(id, module, requireMine);

  // 後悔する変数を返却
  return module.exports;
};

requireMine.cache = {};
requireMine.resolve = (moduleName) => {
  // モジュール名を完全な識別子(ここではファイルパス)に変換する
};

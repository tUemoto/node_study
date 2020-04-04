// named exports
// 一般的なAPI公開の形態
// 公開したい関数や変数をexportsオブジェクトのプロパティとして定義する
// この場合、exportsオブジェクトが機能群のコンテナ、あるいは
// ネームスペースとしての役割をはたす。
// CommonJSの仕様ではnamed exportsのみ許容される
// module.exportsはNode.js独自の拡張
exports.info = (message) => {
  console.log('概要: ', message);
};

exports.verbose = (message) => {
  console.log('詳細: ', message);
};

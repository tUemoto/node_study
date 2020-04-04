// substackパターンは以下のように
// メインとなる関数のみをエクスポートし、
// その関数のプロパティとして副次的な機能を定義するような手法
// 露出部分最小化の原則に合致している。

/**
 * [exports description]
 * module.exportsオブジェクトを丸ごと関数で上書きすることで、
 * この拡張の役割が明快になる
 * @param  {Any} message [description]
 * @return {None}         [description]
 */
module.exports = (message) => {
  console.log('概要: ', message);
};


/**
 * [verbose description]
 * エクスポートされる関数をネームスペースとして使うことで、
 * 他のAPIを公開できる例。
 * 以下のようにすることで、メインのエントリポイントとなる関数に加えて、
 * より高度な利用シーンのみで使われる、副次的な機能を提供できるようになる
 * @param  {Any} message [description]
 * @return {None}         [description]
 */
module.exports.verbose = (message) => {
  console.log('詳細: ', message);
};

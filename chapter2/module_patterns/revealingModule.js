
/**
 * [testmodule description]
 * JavaScriptにはnamespaceが存在しない
 * そのため、アプリケーションやライブラリからグローバルな変更が容易に行える
 * この制限を解決するのが以下のコード。
 * JavaScriptの関数がプライベートなスコープを形成するという性質を利用して、
 * 必要なもののみを外部に公開することができる。
 * @param  {[type]} ( [description]
 * @return {[type]}   [description]
 */
const testmodule = (() => {
  const privateFoo = () => {

  };
  const privateBar = [];
  const exported = {
    publicFoo: () => {},
    publicBar: () => {},
  };

  return exported;
})();

console.log(testmodule);

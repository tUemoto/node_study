// 公開モジュールパターン(revealing module pattern)

/**
 * [testmodule description]
 * @return {Object}  外部に公開したい任意の値。
 * JavaScriptには名前空間がないため、アプリケーションやライブラリから
 * 容易に変更ができるという欠点がある。
 * その欠点を補うために、
 * JavaScriptの関数がプライベートなスコープを形成するという性質を利用し、
 * 必要なものだけを外部に公開することができる。
 */
const testmodule = (() => {
  const privateFoo = (num) => {
    console.log('private foo');
    return num + 5;
  };
  const privateBar = (num) => {
    console.log('private bar');
    return num * 2;
  };

  const exported = {
    publicFoo: (num) => {
      console.log('publicFoo');
      return privateFoo(num);
    },
    publicBar: (num) => {
      console.log('publicBar');
      return privateBar(num);
    },
  };
  return exported;
});

console.log(testmodule());

console.log(testmodule().publicFoo(3));
console.log(testmodule().publicBar(3));
try {
  testmodule().privateBar(3);
} catch (e) {
  console.log(e);
}

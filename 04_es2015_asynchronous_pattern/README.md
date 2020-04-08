# ES2015以降の機能を使った非同期パターン

## プロミス

プロミスは **非同期処理の結果を表現するオブジェクト** 。
非同期処理をラップするオブジェクトだと考えるとシンプル。
最大の良さは **非同期処理で例外を扱える** こと。
プロミスのインスタンスは以下の状態を持つことで、ラップしている非同期処理の実行結果を表現している。

* pending
  まだ実行されていない状態(fullfilledでもrejectedでもない)
* fullfilled
  非同期処理が成功した
* rejected
  非同期処理に失敗した

Promiseによりラップした関数を実行すると、Promiseインスタンスが返される。Promiseインスタンスから関数の実行結果を受け取るには`then`を使う。以下のように書く

```JavaScript

promise.then([onFullfilled], [onRejected]);

```

`then`は新たにプロミスオブジェクトを生成して戻り値として返す。
これもonFullfilled、 onRejectedハンドラの戻り値によって解決される。
例えば、ハンドラも戻り値をxとした時の新しいプロミス(_P_)の最終的な処理結果は

* xが not thenable: _P_ はxと共にfullfill
* xが thenable: _P_ はxが解決されるまで待つ。xがfullfillされた場合、その処理結果と共に _P_ もfullfillされる。xがrejectされた場合、その理由と共に _P_ もrejectされる。

`then`は別のプロミスオブジェクトを返すため、複数のプロミスを連続して呼び出すことができる(プロミスチェーン)。また、`obFullfiled()`や`onRejected()`ハンドラを指定しなかった場合、処理結果はプロミスチェーンの次のプロミスオブジェクトへと引き継がれる。そのため、エラーを伝播させてメソッドチェーンの最後のプロミスでキャッチすることが可能になる。

```JavaScript

asyncOperation(arg)
  .then((result1) => {
    // プロミスを返却
    return asyncOperation(arg2);
  })
  .then((result2) => {
    // 値を返す
    return 'done';
  })
  .then((undefined, err) => {
    // チェーン内にエラーがあればここでキャッチ
  })

```

ES2015のプロミスが提供しているAPIは以下の通り。

* コンストラクタ(`new Promise(function(resolve, reject) {})`)
  - プロミスオブジェクトを生成。
  - resolve, rejectのどちらになるかは引数として渡される関数によって決定される
    - `resolve(obj)`: プロミスをresolveするために使う。objに渡された値と共にプロミスがresolveされる。objにthenableが渡された場合、それが解決された時点でプロミスがresolveされる
    - `reject(err)`: プロミスをrejectするために使う。プロミスはerrと共に即座にrejectされる
* 静的メソッド(スタティックメソッド)
  - `Promise.resolve(obj)`
    - 新しいプロミスを生成。objが非thenableならプロミスはその値と主に即座にresolveされる。objがthenableなら、その処理結果によってプロミスは解決される
  - `Promise.reject(err)`
    - 新しいプロミスを生成。プロミスはerrと共に即座にrejectされる。
  - `Promise.all(iterable)`
    - 新しいプロミスを生成。iterableに含まれる全てのthenableがfullfillされた時点でプロミスはそれらの処理結果を含む反復可能オブジェクトと共にfullfillされる。また、itarableに含まれるいずれかのthenableがrejectされた時点で、プロミスはその理由と共にrejectされる。
  - `Promise.race(iterable)`
    - 新しいプロミスを生成。iterableに含まれるいずれかのthenableが解決した時点でプロミスはその値もしくは理由と共に解決される。
* インスタンスメソッド
  - `promise.then(onFullfilled, onRejected)`
  - `promise.catche(onRejected)`
    - `promise.then(undefined, onRejected)`のシンタックスシュガー

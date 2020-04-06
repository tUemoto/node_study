# コールバックを用いた非同期パターン

## 逐次処理まとめ

配列の各要素に対して非同期処理のタスクを実行する方法。
 **用途:**

  1. 各要素を処理結果で上書きすることで配列を別の配列へと変換する(map)
  2. 前の要素の処理結果を次の要素の処理の入力として順次渡すことで配列を単一の値へと変換する(reduce)

 **注意:**
 `task()`は非同期関数。同期だった場合、関数の呼び出しの階層が深くなると、スタックサイズの限界に達することがある。

```JavaScript
function iterate(index) {
  if (index === tasks.length) {
    return finish();
  }
  const task = tasks[index];
  task(function() {
    iterate(index + 1);
  });

  function finish() {
    //イテレーション完了
  }
}

iterate(0);
```

これをさらに一般化すると以下の様になる

```JavaScript
/**
 * [iterateSeries description]
 * 繰り返し処理を実行する関数
 * @param  {Array} collection    繰り返し処理を行いたい対象
 * @param  {Function} iteratorCallback current( = collection[i] )とコールバック関数を引数にとる関数
 * @param  {Function} finalCallback 処理の終了・中断時に呼ばれる関数
 * @return {None} 
 */
function iterateSeries(collection, iteratorCallback, finalCallback) {
  const threshold = collection.length;
  function iterate (index) {
    if (index === threshold) {
      return finalCallback()
    }
  }
  const current = collection[index];

  iteratorCallback(current, (err) => {
    if (err) {
      return finalCallback(err)
    }
    return iterate(index + 1)
  })

  iterate(0)
}

```

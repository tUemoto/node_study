# コールバックを用いた非同期パターン

## 逐次処理

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
    const current = collection[index];

    iteratorCallback(current, (err) => {
      if (err) {
        return finalCallback(err)
      }
      return iterate(index + 1)
    })
  }

  iterate(0)
}

```

## 並行処理

並行処理は、複数の非同期処理を実行する際に、処理の順番が特に重要ではなく、全ての処理が完了した際に通知してくれさえすれば事足りる時に使う。

Nodeはシングルスレッドアーキテクチャなのにどうやってタスクを並行処理するのか?
-> イベントループによりインタリーブされる形で複数のタスクが交互に実行される。

上記を再利用可能なパターンとして一般化すると次の様になる

```JavaScript
const tasks =[ /*....*/ ];
let completed = 0;

tasks.forEach((task) => {
  task(() => {
    if (++completed === tasks.length) {
      finish();
    }
  })
});

function finish() {
  // 全てのタスク終了
}

```

### 並行処理における競合状態

Nodeは他の言語と違って単一のスレッドで複数のタスクを処理する様に設計されているため、並行処理は極々普通の状態(むしろこれこそがNodeの強み)。
一方でタスク間の同期や、競合状態に対しては、非同期処理の完了を待ち受けるタスク間での同期の際の問題が日常的に発生するため注意が必要(複数のタスクが同じ対象に対して同じ処理を実行すると、進捗によっては結果が変わってしまう場合がある)。

### 同時実行数を制限した並行処理パターン

並行処理を行う場合、同時実行数を際限なく増やすと、いずれ過負荷の問題を招く。
それを防ぐには、同時実行可能なタスク数の制御が重要。
これにより、アプリケーションの負荷の最大値を予測でき、システムのリソースを使い切ってしまう事態を避けられる。

これを実現するためのアルゴリズムは次の通り。

1. 最初に制限いっぱいまでタスクを起動する
2. タスクが完了するたびに制限いっぱいまでタスクを起動する

これをコードにまとめると以下のようになる

```JavaScript
const tasks = ...;
const concurrency = 2;
let running = 0;
let completed = 0;
let index = 0;

function next() {
  while (running < concurrency && index < tasks.length) {
    task = tasks[index++];
    task(() => {
      if (completed === tasks.length) {
        return finish();
      }
      completed++;
      running--;
      next()
    })
  }
}

next();

function finish() {
  // 全てのタスク終了
}
```

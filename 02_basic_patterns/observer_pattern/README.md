# オブザーバーパターン

Nodeの非同期処理をうまく扱うための機構で、コールバックを補完する。
以下が厳密な定義

オブザーバーパターン
> サブジェクト(subject)と呼ばれるオブジェクトと、サブジェクトの状態が変化した時に通知を受け取る「オブザーバ」もしくは「リスナー」と呼ばれる複数のオブジェクトからなる。
> コールバックパターンとの最大の違いは、サブジェクトが(一般的には)複数のオブザーバに対して通知する点である。従来のCPS(継続渡しスタイル)のコールバックは、通常その結果を一つのリスナー(コールバック)に対してのみ伝播する。

## EventEmitterクラス

従来のオブジェクト指向プログラミング言語に置いて、オブザーバーパターンを実現しようとすると、

* インターフェース
* 抽象クラス
* 具象クラス

の様に、複数のパーツを実装する必要があるが、Nodeにおいてはオブザーバーパターンが既にコアモジュールの機能としてサポートされている。
コアモジュールのEventEmitterというクラスを使えば、特定のイベントが発生した時に呼び出される関数をリスナーとして登録できる。

EventEmitterクラスは、Nodeのコアモジュールであるeventsモジュールで定義されている。次の様に参照を取得する。

```
const EventEmitter = require('events').EventEmitter;
const eeInstance = new EventEmitter();
```

以下がEventEmitterの主要な関数

* `on(event, listener)`
  特定のイベントに対してリスナー関数を登録
* `once(event, listener)`
  `on`と同じだが、登録されたリスナーは一度しか呼び出されず、呼び出し後に登録解除される
* `emit(event, [arg1], [...])`
  イベントを発行(emit)する。`emit`されたイベントは引数(arg1, arg2, ...)と共に、全てのリスナーに通知される
* `removeListener(event, listener)`
  指定されたリスナーを登録解除する。

各メソッドは戻り値に自身のインスタンスを返すので、メソッドチェーンが可能。リスナー関数のシグニチャは`function([引数1], [...])`となっており、`emit`の第2引数以降がそのまま渡る。リスナーの内部では`this`は`emit`の対象となるEventEmitterのインスタンスを参照する。

リスナーはNodeのコールバックと異なり、第1引数にエラーオブジェクトをとらず、`emit`が呼び出された時の引数が渡される点に注意。

## エラーの伝播

EventEmitter内でエラーが発生した場合、コールバック内のエラーと同様、呼び出しもとはイベントループなので、例外がthrowされてもアプリケーションがそれをキャッチすることができない。そのため、errorという滑の特別なイベントをemitするのが慣習となっている。errorイベントにはErrorオブジェクトが引数として渡される。Nodeはエラー発生時にリスナーが見つからない場合、例外をthrowしてプログラムの実行を停止する。

## 同期イベントと非同期イベント

EventEmitterもコールバックと同様に、同期・非同期いずれの方法でも`emit`することが可能(ただし一般的には非同期で行うため、同期で行う場合にはその旨を明記することが推奨される)。
EventEmitterの初期化後に`on`または`once`でリスナーを登録する場合は非同期イベントになる(ほとんどのNodeのモジュールはこの方法でイベントを通知する)。裏を返せば、EventEmitterがイベントを`emit`できる様になる前に(ex. コンストラクタ内とか)でリスナーが登録されていなければ、同期イベントを実現することは不可能。

## コールバックとの使い分け

> _コールバックは一つの処理に対して一つのコールバックしか登録できないが、EventEmitterは一つの処理に対して複数のリスナーを登録できる_

原則は **単に非同期処理を実現したいだけならコールバックを使う**。
ただし、以下の場合はEventEmitterの使用が推奨される。

* コールバックは複数のイベントを扱う時(コールバックでも実装自体は可能だが、きれいとは言い難いコードになる)。
* 同じイベントが複数回発生したり、1回も発生しなかったり、発生回数が予測できない場合。

## EventEmitterとコールバックの組み合わせ

コールバックを引数として受け取り、EventEmitterオブジェクトを戻り値として返す関数を定義することで、簡潔なエントリポイントをメインの機能として提供し、より詳細なイベントをEventEmitterを使って通知できる。
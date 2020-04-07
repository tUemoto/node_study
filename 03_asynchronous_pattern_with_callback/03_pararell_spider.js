const request = require('request');
const fs = require('fs');
// mkdirpは1.x系では動かないので注意。0.x系の最新は0.5.5
const mkdirp = require('mkdirp');
const path = require('path');
const utilities = require('./utilities');


function saveFile(filename, contents, callback) {
  mkdirp(path.dirname(filename), (err) => {
    if (err) {
      return callback(err);
    }
    fs.writeFile(filename, contents, callback);
  });
}

function download(url, filename, callback) {
  console.log(`Downloading ${url}`);
  request(url, (err, response, body) => {
    if (err) {
      return callback(err);
    }
    saveFile(filename, body, (err) => {
      if (err) {
        return callback(err);
      }
      console.log(`Downloaded and saved: ${url}`);
      callback(null, body);
    });
  });
}

/**
 * [spiderLinks description]
 * 指定したURLのページにあるリンクを探索する。
 * @param  {String}   currentUrl [description]
 * @param  {String}   body       [description]
 * @param  {Integer}   nesting   どの深さのリンクまで探索するか
 * @param  {Function} callback   [description]
 * @return {Undefined}              [description]
 */
function spiderLinks(currentUrl, body, nesting, callback) {
  if (nesting === 0) {
    return process.nextTick(callback);
  }

  const links = utilities.getPageLinks(currentUrl, body);
  console.log(links);
  if (links.length === 0) {
    return process.nextTick(callback);
  }

  let completed = 0;
  let hasErrors = false;

  function done(err) {
    if (err) {
      hasErrors = true;
      return callback(err);
    }
  }
  completed += 1;
  if (completed === links.length && !hasErrors) {
    return callback();
  }

  links.forEach((link) => {
    spider(link, nesting - 1, done);
  });
}

/**
 * [spidering description]
 * タスク間の同期をとるための変数
 * これによって同じURLに対して複数回requestが飛ぶことを防ぐ
 * @type {Map}
 */
const spidering = new Map();
/**
 * 機能単位で関数を切り出して、関数単位の行数を削減
 * 早期リターンで、ネストを一段浅くしたバージョン
 * @param  {[type]}   url      [description]
 * @param  {Function} callback [description]
 * @return {[type]}            [description]
 */
function spider(url, nesting, callback) {
  if (spidering.has(url)) {
    return process.nextTick(callback);
  }
  const filename = utilities.urlToFilename(url);
  fs.readFile(filename, 'utf8', (err, body) => {
    if (err) {
      if (err.code !== 'ENOENT') {
        return callback(err);
      }
      return download(url, filename, (err, body) => {
        if (err) {
          return callback(err);
        }
        spiderLinks(url, body, nesting, callback);
      });
    }
    spiderLinks(url, body, nesting, callback);
  });
}

console.log(process.argv);
spider(process.argv[2], process.argv[3], (err, filename, downloaded) => {
  if (err) {
    console.log(err);
  } else if (downloaded) {
    console.log(`Completed the download of "${filename}"`);
  } else {
    console.log(`"${filename}" was already downloaded`);
  }
});

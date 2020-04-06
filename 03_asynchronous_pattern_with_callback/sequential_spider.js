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

  /**
   * [iterate description]
   * 指定のindexまで、linksを深く探索する
   * @param  {integer} index [description]
   * @return {Undefined | Function()}       [description]
   */
  function iterate(index) {
    if (index === links.length) {
      return callback();
    }
    spider(links[index], nesting - 1, (err) => {
      if (err) {
        return callback(err);
      }
      iterate(index + 1);
    });
  }
  iterate(0);
}

/**
 * 機能単位で関数を切り出して、関数単位の行数を削減
 * 早期リターンで、ネストを一段浅くしたバージョン
 * @param  {[type]}   url      [description]
 * @param  {Function} callback [description]
 * @return {[type]}            [description]
 */
function spider(url, nesting, callback) {
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

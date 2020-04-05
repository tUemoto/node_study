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
 * 機能単位で関数を切り出して、関数単位の行数を削減
 * 早期リターンで、ネストを一段浅くしたバージョン
 * @param  {[type]}   url      [description]
 * @param  {Function} callback [description]
 * @return {[type]}            [description]
 */
function spider(url, callback) {
  const filename = utilities.urlToFilename(url);
  fs.exists(filename, (exists) => {
    if (!exists) {
      download(url, filename, (err) => {
        if (err) {
          return callback(err);
        }
        callback(null, filename, true);
      });
    } else {
      callback(null, filename, false);
    }
  });
}

spider(process.argv[2], (err, filename, downloaded) => {
  if (err) {
    console.log(err);
  } else if (downloaded) {
    console.log(`Completed the download of "${filename}"`);
  } else {
    console.log(`"${filename}" was already downloaded`);
  }
});

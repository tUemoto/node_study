const request = require('request');
const fs = require('fs');
// mkdirpは1.x系では動かないので注意。0.x系の最新は0.5.5
const mkdirp = require('mkdirp');
const path = require('path');
const utilities = require('./utilities');

/**
 * callback hell のお手本
 * @param  {[type]}   url      [description]
 * @param  {Function} callback [description]
 * @return {[type]}            [description]
 */
function spider(url, callback) {
  const filename = utilities.urlToFilename(url);
  console.log('filename is ', filename);
  console.log('dirname: ', path.dirname(filename));
  fs.exists(filename, (exists) => {
    if (!exists) {
      console.log(`Downloading ${url}`);
      request(url, (err, response, body) => {
        if (err) {
          callback(err);
        } else {
          mkdirp(path.dirname(filename), (mkdirErr) => {
            if (mkdirErr) {
              callback(mkdirErr);
            } else {
              fs.writeFile(filename, body, (fsErr) => {
                if (fsErr) {
                  callback(fsErr);
                } else {
                  callback(null, filename, true);
                }
              });
            }
          });
        }
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

var logger = require("loggero").create("readFile");
var fs = require("fs");
var pstream = require("p-stream");
var isBinaryFile = require("isbinaryfile");


/**
 * Function that reads file from disk
 *
 * @param {{ string: path }} input - Module meta with information about the module being loaded
 */
function fileReader(input) {
  function setSource(text) {
    return {
      source: text
    };
  }

  function logError(err) {
    logger.error(input.path, err);
    throw err;
  }

  return pstream(readFile(input.path)).then(setSource, logError);
}


/**
 * Read file from storage.
 *
 * @private
 *
 * @param {string} filePath - Full path for the file to be read
 *
 * @returns {Promise}
 */
function readFile(filePath) {
  var stream = fs.createReadStream(filePath);
  return isBinaryFile.sync(filePath) ? stream : stream.setEncoding("utf8");
}


module.exports = fileReader;

var fs = require("fs");
var pstream = require("p-stream");
var isBinaryFile = require("isbinaryfile");

/**
 * Function that reads file from disk
 *
 * @param {{ string: path }} input - Module meta with information about the module being loaded
 */
function fileReader(input) {
  var stream = fs.createReadStream(input.path);
  return pstream(stream).then(setSource, logError);

  function setSource(text) {
    stream.close();
    return {
      source: isBinaryFile.sync(text, text.length) ? text : text.toString()
    };
  }

  function logError(err) {
    stream.close();
    throw err;
  }
}

module.exports = fileReader;

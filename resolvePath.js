var logger = require("loggero").create("resolvePath");
var browserResolve = require("browser-resolve");


function getDirectory(path) {
  return path.replace(/([^/]+)$/gmi, function() {return "";});
}


/**
 * Resolves the path for modules.
 *
 * @param {{ string: name }} input - Object with module `name` to resolve the path for.
 * @returns {Promise}
 */
function resolver(input) {
  return resolve(input, { baseUrl: process.cwd() + "/some-file-does-is-only-for-browser-resolve.abc"});
}


/**
 * Configurator for resolver. This will create and return a resolve function to be
 * called with the input object.
 *
 * @param {object} options - Options for `browser-resolve`. Defaults `baseUrl` to `process.cwd()`.
 * @returns {function} to be called with object containing module `name` to be resolved.
 */
resolver.configure = function(options) {
  options = options || {};

  if (!options.baseUrl) {
    options.baseUrl = process.cwd() + "/some-file-does-is-only-for-browser-resolve.abc";
  }

  return function resolveDelegate(input) {
    return resolve(input, options);
  };
};


/**
 * Convert module name to full module path
 *
 * @private
 */
function resolve(input, options) {
  function setPath(path) {
    if (path) {
      return {
        directory: getDirectory(path),
        path: path
      };
    }
  }

  function logError(err) {
    logger.error(input.name, err);
    throw err;
  }

  return resolvePath(input, options).then(setPath, logError);
}


/**
 * Figures out the path for the input so that the module file can be loaded from storage.
 *
 * We use browser-resolve to do the heavy lifting for us, so all this module is really doing
 * is wrapping browser-resolve so that it can be used by bit loader in a convenient way.
 *
 * @private
 */
function resolvePath(input, options) {
  var parentPath = getParentPath(input, options);

  // Experimental use of app paths by name rather then path.  E.g.
  // require('app/test');
  // vs
  // require('./app/test);
  //
  //  var filePath = path.resolve(path.dirname(options.baseUrl), input.name);
  //  var stat = fs.statSync(filePath);
  //
  //  if (stat.isFile()) {
  //    return Promise.resolve(filePath);
  //  }

  return new Promise(function(resolve) {
    browserResolve(input.name, { filename: parentPath }, function(err, filePath) {
      resolve(filePath);
    });
  });
}


/**
 * Gets the path for the module requesting the input being resolved. This is what
 * happens when a dependency is loaded.
 *
 * @private
 */
function getParentPath(input, options) {
  var referrer = input.referrer;
  return (referrer && input !== referrer && referrer.path) ? referrer.path : options.baseUrl;
}


module.exports = resolver;

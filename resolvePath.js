var path = require("path");
var browserResolve = require("browser-resolve");
var fs = require("fs");
var cache = {};

function getDirectory(path) {
  return path && path.replace(/([^/]+)$/gm, "");
}

function resolver(input) {
  return resolvePath(input, { baseUrl: process.cwd() });
}

resolver.configure = function(options) {
  options = options || {};

  if (!options.baseUrl) {
    options.baseUrl = process.cwd();
  }

  return function resolveDelegate(input) {
    return resolvePath(input, options);
  };
};

function resolvePath(input, options) {
  var parentPath = getParentPath(input, options);
  var cached = getCached(input);

  if (cached) {
    return cached.then(setPath);
  }

  var deferred = localResolve(input, parentPath) || nodeResolve(input, parentPath);
  setCached(input, deferred);
  return deferred.then(setPath);
}

function setPath(filePath) {
  if (filePath) {
    return {
      directory: getDirectory(filePath),
      path: filePath
    };
  }
}

function localResolve(input, parentPath) {
  if (input.name.indexOf("://") !== -1 || /^[\.\/]/.test(input.name)) {
    var filePath = path.resolve(parentPath, input.name);
    var stat = getSafeFileStat(filePath);

    if (stat && stat.isFile()) {
      return Promise.resolve(filePath);
    }
  }
}

function nodeResolve(input, parentPath) {
  return new Promise(function(resolve, reject) {
    browserResolve(input.name, { basedir: parentPath }, function(err, filePath) {
      if (err) {
        reject(err);
      }
      else {
        resolve(filePath);
      }
    });
  });
}

function getSafeFileStat(filePath) {
  try {
    return fs.statSync(filePath);
  }
  catch(ex) {
    if (ex.code !== "ENOENT") {
      throw ex;
    }
  }
}

function getParentPath(input, options) {
  var referrer = input.referrer;
  return (referrer && input !== referrer && referrer.path) ? getDirectory(referrer.path) : options.baseUrl;
}

function getCached(input) {
  var directory = getDirectory(input.referrer && input.referrer.path);

  if (cache[directory]) {
    return cache[directory][input.name];
  }
}

function setCached(input, value) {
  var directory = getDirectory(input.referrer && input.referrer.path);

  if (directory) {
    if (!cache[directory]) {
      cache[directory] = {};
    }

    cache[directory][input.name] = value;
  }
}

module.exports = resolver;

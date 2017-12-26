var moduleResolver = require("resolve");
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
    return cached.then(buildResult);
  }

  var deferred = resolveModule(input, parentPath);
  setCached(input, deferred);
  return deferred.then(buildResult);
}

function buildResult(filePath) {
  if (filePath) {
    return {
      directory: getDirectory(filePath),
      path: filePath
    };
  }
}

function resolveModule(input, parentPath) {
  return new Promise(function(resolve, reject) {
    try {
      resolve(moduleResolver.sync(input.name, { basedir: parentPath }));
    }
    catch(ex) {
      reject(ex);
    }
  });
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

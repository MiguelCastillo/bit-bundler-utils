# bit-bundler-utils
Helpers for bit-bundler

This provides a utility method for generating unique ids suitable for bundles, and a configurable node.js module resolver.

### getUniqueId
Method that generates numeric ids from a module id as generated by [bit-loader](https://github.com/MiguelCastillo/bit-loader). Useful for saving a few bytes in bundle size and obfuscate the path where the modules in the bundle came from.

- @param {string} moduleId - module id generated by bit-loader to convert to module id consumed by bit-bundler.

- @returns {int} module id to be consumed by bit-bundler.

> getUniqueId will cache the results it produces so that subsequent calls with the same input generates the exact same output.

### resolvePath
Helper module for resolving module names and relative paths to full paths that can be used for reading module files from storage. This uses [browser-resolve](https://github.com/defunctzombie/node-browser-resolve) as the backing engine for node.js module resolution. `resolvePath` takes in options that are passed to `browser-resolve`, and by default `resolvePath` will set the `baseUrl` setting to `process.cwd()` is one isn't specified.

- @param {{ string: name }} moduleMeta - Module meta generated by bit-loader with the name of the module to be resolved.
- @param {object} browserResolveOptions - Options to be fowarded to browser-resolve. `resolvePath` will automatically set `baseUrl` is one isn't specified.

- @returns {Promise} Promise that when resolved, an object is returned with a full `path` property for the module.

[bit-bundler](https://github.com/MiguelCastillo/bit-bundler/blob/master/src/loader.js) uses this module as a resolver for bit-loader in order to locate module files on disk.

#### Example

Basic example:

``` javascript
var resolvePath = require("bit-bundler-utils/resolvePath");
var resolver = resolvePath();

resolver({
  name: "jquery"
})
.then(function(result) {
  console.log(result.path);
  return result;
});
```


License
===============

Licensed under MIT

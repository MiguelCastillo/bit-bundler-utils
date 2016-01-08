var utils = require("belty");
var types = require("dis-isa");


var defaults = {
  resolve: [],
  fetch: [],
  transform: [],
  dependency: []
};


function Plugin(options) {
  this._configuration = configure(utils.merge({}, defaults), options);
}


Plugin.prototype.configure = function(options) {
  this._configuration = configure(this._configuration, options);
  return this;
};


Plugin.prototype.build = function() {
  return utils.merge({}, this._configuration);
}


Plugin.create = function(options) {
  return new Plugin(options);
};


function configure(pluginConfig, options) {
  options = options || {};

  Object.keys(options)
    .filter(function(option) {
      return defaults.hasOwnProperty(option);
    })
    .map(function(option) {
      var value = options[option];
      return {
        name: option,
        value: types.isArray(value) ? value : [value]
      };
    })
    .forEach(function(config) {
      pluginConfig[config.name] = pluginConfig[config.name].concat(config.value);
    });

  if (options.match) {
    pluginConfig.match = utils.merge({}, pluginConfig.match, options.match);
  }

  if (options.ignore) {
    pluginConfig.ignore = utils.merge({}, pluginConfig.ignore, options.ignore);
  }

  return pluginConfig;
};


module.exports = Plugin;

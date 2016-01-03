//
// http://24ways.org/2013/grunt-is-not-weird-and-hard/
//
module.exports = function(grunt) {
  "use strict";

  require("load-grunt-tasks")(grunt);

  var pkg = require("./package.json");

  grunt.initConfig({
    pkg: pkg,

    eslint: {
      all: {
        options: {
          //format: require("eslint-tap")
        },
        src: ["src/**/*.js", "*.js"]
      }
    },

    release: {
      options: {
        tagName: "v<%= version %>",
        tagMessage: "Version <%= version %>",
        commitMessage: "Release v<%= version %>",
        afterBump: ["build"]
      }
    }
  });

  grunt.registerTask("build", ["eslint:all"]);
};

// fansekey@gmail.com

var fs = require('fs');
var path = require('path');
var util = require('util');

function Helper() {
  this.hackers = (function(type) {
    var root = path.join(__dirname, 'lib', 'hackers');
    try {
      var files = fs.readdirSync(root);
      var hackers = {};
      files.map(function(filename) {
        if (/\.js$/.test(filename)) {
          hackers[filename.replace(/\.js$/, '')] = require(path.join(root, filename));
        }
      });
    } catch (e) {}
    return hackers;
  })();
}

Helper.prototype.register = function () {
};

Helper.prototype.require = function (id, opt) {
};

Helper.prototype.hack = function (className) {
  if (this.hackerExists(className)) {
    this.hackers[className]();
  }
};

Helper.prototype.addHacker = function (className, constructor) {
  this.hacker[className] = constructor;
};

Helper.prototype.hackerExists = function (className) {
  return !!this.hackers[className];
};

Helper.prototype.getBuildInPlugin = function (pluginName) {
  
  var requireInfo = process.mainModule;
  var root = path.join(path.dirname(requireInfo.paths[1]), 'lib');
  var childModuleRoot = requireInfo.paths[1];

  try {
    return require(path.join(root, pluginName));
  } catch (e) {
    try {
      return require(path.join(childModuleRoot, pluginName)); 
    } catch (e) {
      try {
        return require(path.join(childModuleRoot, 'fis', 'node_modules', pluginName));
      } catch (e) {}
    }
  }

  return null;
};

module.exports = new Helper();
module.exports.Helper = Helper;

// fansekey@gmail.com

'use strict';

function normalizePlugin(arg) {
  if (fis.util.is(arg, 'Array')) {
    return arg;
  }

  if (fis.util.is(arg, 'String')) {
    arg = arg.split(/\s*,\s*/);
  } else if (fis.util.is(arg, 'Function')) {
    arg = [arg];
  } else {
    fis.log.error('Invalid plugin: ' + arg);
  }

  return arg;
}

function normalizeDefaultConfig() {
  var defaultConfig = fis.config.get();
  var compilerPlugin = [
    'parser',
    'preprocessor',
    'postprocessor',
    'lint',
    'test',
    'optimizer'
  ];

  var packagerPlugin = [
    'prepackager',
    'packager',
    'spriter',
    'postpackager'
  ];

  compilerPlugin.forEach(function(pluginType) {
    var conf = fis.config.get('modules.' + pluginType, null);
    if (!conf) {
      return;
    }
    fis.util.map(conf, function (ext, plugins) {
      conf[ext] = normalizePlugin(plugins);
    });
  });

  packagerPlugin.forEach(function(pluginType) {
    var plugins = fis.config.get('modules.' + pluginType);
    fis.config.set('modules.' + pluginType, normalizePlugin(plugins));
  });
}

module.exports = function () {
  fis.config.merge = function (obj) {
    normalizeDefaultConfig();

    if (obj['modules']) {
      fis.util.map(obj['modules'], function (pluginType, conf) {
        if (fis.util.is(conf, 'Object')) {
          // compiler
          fis.util.map(conf, function (ext, plugins) {
            fis.config.append('modules.' + pluginType + '.' + ext, plugins);
          });
        } else {
          // packager
          fis.config.append('modules.' + pluginType, conf);
        }
      });
      delete  obj['modules'];
    }

    if (obj['roadmap'] && obj['roadmap']['path']) {
      fis.config.set('roadmap.path', obj['roadmap']['path'].concat(fis.config.get('roadmap.path')));
      delete obj['roadmap'];
    }

    this.__proto__.merge.apply(this, arguments);
  }

  fis.config.__proto__.disable = function (type, plugin) {
    if (!fis.util.is(plugin, 'String')) {
      return;
    }

    plugin = plugin.split(/\s*,\s*/);
    var defaultPlugin = normalizePlugin(fis.config.get(type, []));
    plugin.forEach(function (idx) {
      var p;
      if (~(p = defaultPlugin.indexOf(idx))) {
        // remove
        defaultPlugin.splice(p, 1);
      }
    });
    fis.config.set(type, defaultPlugin);
  }

  fis.config.__proto__.append = function (type, plugin) {
    if (fis.util.is(plugin, 'Object')) {
      if (plugin.type == 'fis.plugin') {
        var tmp = type.split('.');
        fis.config.set('settings.' + tmp[1] + '.' + plugin.name, plugin.settings);
        plugin = plugin.name;
      } else {
        fis.log.error('Plugin must a string or a array, or `fis.plugin()`');
      }
    }
    var defaultPlugin = fis.config.get(type, []);
    defaultPlugin = normalizePlugin(defaultPlugin);
    plugin = normalizePlugin(plugin);
    fis.config.set(type, defaultPlugin.concat(plugin));
  }
  
  // simple plugin API
  fis.plugin = function (name, settings) {
    return {
      name: name,
      type: 'fis.plugin',
      settings: settings
    };
  }

};

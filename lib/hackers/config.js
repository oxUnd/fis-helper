// fansekey@gmail.com

'use strict';

function adjust(arg) {
  if (fis.util.is(arg, 'Array')) {
    return arg;
  }

  if (fis.util.is(arg, 'String')) {
    arg = arg.split(/\s*,\s*/);
  } else if (fis.util.is(arg, 'Function')) {
    arg = [arg];
  } else {
    arg = [];
  }

  return arg;
}

module.exports = function () {
  fis.config.merge = function (obj) {
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
    var defaultPlugin = adjust(fis.config.get(type, []));
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
    defaultPlugin = adjust(defaultPlugin);
    plugin = adjust(plugin);
    fis.config.set(type, defaultPlugin.concat(plugin));
  }

  fis.plugin = function (name, settings) {
    return {
      name: name,
      type: 'fis.plugin',
      settings: settings
    };
  }

};

// fansekey@gmail.com

'use strict';

module.exports = function () {
  fis.config.merge = function (obj) {
    if (obj['roadmap'] && obj['roadmap']['path']) {
      fis.config.set('roadmap.path', obj['roadmap']['path'].concat(fis.config.get('roadmap.path')));
      delete obj['roadmap'];
    }
    this.__proto__.merge.apply(this, arguments);
  }
};

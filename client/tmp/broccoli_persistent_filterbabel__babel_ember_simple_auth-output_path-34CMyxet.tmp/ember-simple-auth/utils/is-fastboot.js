define("ember-simple-auth/utils/is-fastboot", ["exports"], function (_exports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = isFastBoot;

  function isFastBoot(owner) {
    (true && !(owner && typeof owner.lookup === 'function') && Ember.assert('You must pass in an owner to isFastBoot!', owner && typeof owner.lookup === 'function'));
    var fastboot = owner.lookup('service:fastboot');
    return fastboot ? fastboot.get('isFastBoot') : false;
  }
});
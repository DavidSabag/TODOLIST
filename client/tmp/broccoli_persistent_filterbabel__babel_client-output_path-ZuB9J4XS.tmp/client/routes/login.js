define('client/routes/login', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.Route.extend({
    session: Ember.inject.service(),

    beforeModel: function beforeModel() {
      this.get('session').prohibitAuthentication('index');
    }
  });
});
define('client/routes/todos', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.Route.extend({
    session: Ember.inject.service(),

    beforeModel: function beforeModel(transs) {
      this.get('session').requireAuthentication(transs, 'login');
    }
  });
});
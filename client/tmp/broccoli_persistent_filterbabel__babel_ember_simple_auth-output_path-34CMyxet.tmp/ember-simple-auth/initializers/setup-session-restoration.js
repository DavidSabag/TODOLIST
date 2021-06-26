define("ember-simple-auth/initializers/setup-session-restoration", ["exports"], function (_exports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = setupSessionRestoration;

  function setupSessionRestoration(registry) {
    var ApplicationRoute = registry.resolveRegistration ? registry.resolveRegistration('route:application') : registry.resolve('route:application');
    ApplicationRoute.reopen({
      init: function init() {
        this._super.apply(this, arguments);

        var originalBeforeModel = this.beforeModel;

        this.beforeModel = function () {
          var _arguments = arguments,
              _this = this;

          if (!this.__usesApplicationRouteMixn__) {
            var sessionService = Ember.getOwner(this).lookup('service:session');

            sessionService._setupHandlers();
          }

          var session = Ember.getOwner(this).lookup('session:main');
          return session.restore().then(function () {
            return originalBeforeModel.apply(_this, _arguments);
          }, function () {
            return originalBeforeModel.apply(_this, _arguments);
          });
        };
      }
    });
  }
});
define("ember-simple-auth/-internals/routing", ["exports", "ember-simple-auth/utils/is-fastboot", "ember-simple-auth/utils/location"], function (_exports, _isFastboot, _location) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.requireAuthentication = requireAuthentication;
  _exports.triggerAuthentication = triggerAuthentication;
  _exports.prohibitAuthentication = prohibitAuthentication;
  _exports.handleSessionAuthenticated = handleSessionAuthenticated;
  _exports.handleSessionInvalidated = handleSessionInvalidated;

  function requireAuthentication(owner, transition) {
    var sessionService = owner.lookup('service:session');
    var isAuthenticated = sessionService.get('isAuthenticated');

    if (!isAuthenticated) {
      if (transition && (0, _isFastboot.default)(owner)) {
        var fastbootService = owner.lookup('service:fastboot');
        var cookiesService = owner.lookup('service:cookies');
        cookiesService.write('ember_simple_auth-redirectTarget', transition.intent.url, {
          path: '/',
          secure: fastbootService.get('request.protocol') === 'https'
        });
      } else if (transition) {
        sessionService.set('attemptedTransition', transition);
      }
    }

    return isAuthenticated;
  }

  function triggerAuthentication(owner, authenticationRoute) {
    var authRouter = owner.lookup('service:router') || owner.lookup('router:main');
    authRouter.transitionTo(authenticationRoute);
  }

  function prohibitAuthentication(owner, routeIfAlreadyAuthenticated) {
    var authRouter = owner.lookup('service:router') || owner.lookup('router:main');
    authRouter.transitionTo(routeIfAlreadyAuthenticated);
  }

  function handleSessionAuthenticated(owner, routeAfterAuthentication) {
    var sessionService = owner.lookup('service:session');
    var attemptedTransition = sessionService.get('attemptedTransition');
    var cookiesService = owner.lookup('service:cookies');
    var redirectTarget = cookiesService.read('ember_simple_auth-redirectTarget');
    var routerService = owner.lookup('service:router');

    if (attemptedTransition) {
      attemptedTransition.retry();
      sessionService.set('attemptedTransition', null);
    } else if (redirectTarget) {
      routerService.transitionTo(redirectTarget);
      cookiesService.clear('ember_simple_auth-redirectTarget');
    } else {
      routerService.transitionTo(routeAfterAuthentication);
    }
  }

  function handleSessionInvalidated(owner, routeAfterInvalidation) {
    if ((0, _isFastboot.default)(owner)) {
      var routerService = owner.lookup('service:router');
      routerService.transitionTo(routeAfterInvalidation);
    } else {
      if (!Ember.testing) {
        (0, _location.default)().replace(routeAfterInvalidation);
      }
    }
  }
});
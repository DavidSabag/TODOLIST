define("ember-simple-auth/internal-session", ["exports"], function (_exports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;
  var assign = Ember.assign || Ember.merge;

  var _default = Ember.ObjectProxy.extend(Ember.Evented, {
    authenticator: null,
    store: null,
    isAuthenticated: false,
    attemptedTransition: null,
    init: function init() {
      this._super.apply(this, arguments);

      this.set('content', {
        authenticated: {}
      });
      this._busy = false;

      this._bindToStoreEvents();
    },
    authenticate: function authenticate(authenticatorFactory) {
      var _this = this;

      this._busy = true;
      (true && !(!Ember.isEmpty(authenticatorFactory)) && Ember.assert("Session#authenticate requires the authenticator to be specified, was \"".concat(authenticatorFactory, "\"!"), !Ember.isEmpty(authenticatorFactory)));

      var authenticator = this._lookupAuthenticator(authenticatorFactory);

      (true && !(!Ember.isNone(authenticator)) && Ember.assert("No authenticator for factory \"".concat(authenticatorFactory, "\" could be found!"), !Ember.isNone(authenticator)));

      for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        args[_key - 1] = arguments[_key];
      }

      return authenticator.authenticate.apply(authenticator, args).then(function (content) {
        _this._busy = false;
        return _this._setup(authenticatorFactory, content, true);
      }, function (error) {
        var rejectWithError = function rejectWithError() {
          return Ember.RSVP.Promise.reject(error);
        };

        _this._busy = false;
        return _this._clear().then(rejectWithError, rejectWithError);
      });
    },
    invalidate: function invalidate() {
      var _this2 = this;

      this._busy = true;
      this.set('attemptedTransition', null);

      if (!this.get('isAuthenticated')) {
        this._busy = false;
        return Ember.RSVP.Promise.resolve();
      }

      var authenticator = this._lookupAuthenticator(this.authenticator);

      return authenticator.invalidate.apply(authenticator, [this.content.authenticated].concat(Array.prototype.slice.call(arguments))).then(function () {
        authenticator.off('sessionDataUpdated', _this2, _this2._onSessionDataUpdated);
        _this2._busy = false;
        return _this2._clear(true);
      }, function (error) {
        _this2.trigger('sessionInvalidationFailed', error);

        _this2._busy = false;
        return Ember.RSVP.Promise.reject(error);
      });
    },
    restore: function restore() {
      var _this3 = this;

      this._busy = true;

      var reject = function reject() {
        return Ember.RSVP.Promise.reject();
      };

      return this.store.restore().then(function (restoredContent) {
        var _ref = restoredContent.authenticated || {},
            authenticatorFactory = _ref.authenticator;

        if (authenticatorFactory) {
          delete restoredContent.authenticated.authenticator;

          var authenticator = _this3._lookupAuthenticator(authenticatorFactory);

          return authenticator.restore(restoredContent.authenticated).then(function (content) {
            _this3.set('content', restoredContent);

            _this3._busy = false;
            return _this3._setup(authenticatorFactory, content);
          }, function (err) {
            Ember.debug("The authenticator \"".concat(authenticatorFactory, "\" rejected to restore the session - invalidating\u2026"));

            if (err) {
              Ember.debug(err);
            }

            _this3._busy = false;
            return _this3._clearWithContent(restoredContent).then(reject, reject);
          });
        } else {
          delete (restoredContent || {}).authenticated;
          _this3._busy = false;
          return _this3._clearWithContent(restoredContent).then(reject, reject);
        }
      }, function () {
        _this3._busy = false;
        return _this3._clear().then(reject, reject);
      });
    },
    _setup: function _setup(authenticator, authenticatedContent, trigger) {
      var _this4 = this;

      trigger = Boolean(trigger) && !this.get('isAuthenticated');
      this.setProperties({
        isAuthenticated: true,
        authenticator: authenticator,
        'content.authenticated': authenticatedContent
      });

      this._bindToAuthenticatorEvents();

      return this._updateStore().then(function () {
        if (trigger) {
          _this4.trigger('authenticationSucceeded');
        }
      }, function () {
        _this4.setProperties({
          isAuthenticated: false,
          authenticator: null,
          'content.authenticated': {}
        });
      });
    },
    _clear: function _clear(trigger) {
      var _this5 = this;

      trigger = Boolean(trigger) && this.get('isAuthenticated');
      this.setProperties({
        isAuthenticated: false,
        authenticator: null,
        'content.authenticated': {}
      });
      return this._updateStore().then(function () {
        if (trigger) {
          _this5.trigger('invalidationSucceeded');
        }
      });
    },
    _clearWithContent: function _clearWithContent(content, trigger) {
      this.set('content', content);
      return this._clear(trigger);
    },
    setUnknownProperty: function setUnknownProperty(key, value) {
      (true && !(key !== 'authenticated') && Ember.assert('"authenticated" is a reserved key used by Ember Simple Auth!', key !== 'authenticated'));

      var result = this._super(key, value);

      if (!/^_/.test(key)) {
        this._updateStore();
      }

      return result;
    },
    _updateStore: function _updateStore() {
      var data = this.content;

      if (!Ember.isEmpty(this.authenticator)) {
        Ember.set(data, 'authenticated', assign({
          authenticator: this.authenticator
        }, data.authenticated || {}));
      }

      return this.store.persist(data);
    },
    _bindToAuthenticatorEvents: function _bindToAuthenticatorEvents() {
      var authenticator = this._lookupAuthenticator(this.authenticator);

      authenticator.on('sessionDataUpdated', this, this._onSessionDataUpdated);
      authenticator.on('sessionDataInvalidated', this, this._onSessionDataInvalidated);
    },
    _onSessionDataUpdated: function _onSessionDataUpdated(content) {
      this._setup(this.authenticator, content);
    },
    _onSessionDataInvalidated: function _onSessionDataInvalidated() {
      this._clear(true);
    },
    _bindToStoreEvents: function _bindToStoreEvents() {
      var _this6 = this;

      this.store.on('sessionDataUpdated', function (content) {
        if (!_this6._busy) {
          _this6._busy = true;

          var _ref2 = content.authenticated || {},
              authenticatorFactory = _ref2.authenticator;

          if (authenticatorFactory) {
            delete content.authenticated.authenticator;

            var authenticator = _this6._lookupAuthenticator(authenticatorFactory);

            authenticator.restore(content.authenticated).then(function (authenticatedContent) {
              _this6.set('content', content);

              _this6._busy = false;

              _this6._setup(authenticatorFactory, authenticatedContent, true);
            }, function (err) {
              Ember.debug("The authenticator \"".concat(authenticatorFactory, "\" rejected to restore the session - invalidating\u2026"));

              if (err) {
                Ember.debug(err);
              }

              _this6._busy = false;

              _this6._clearWithContent(content, true);
            });
          } else {
            _this6._busy = false;

            _this6._clearWithContent(content, true);
          }
        }
      });
    },
    _lookupAuthenticator: function _lookupAuthenticator(authenticatorName) {
      var owner = Ember.getOwner(this);
      var authenticator = owner.lookup(authenticatorName);
      Ember.setOwner(authenticator, owner);
      return authenticator;
    }
  });

  _exports.default = _default;
});
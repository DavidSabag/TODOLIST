define("ember-simple-auth/authenticators/oauth2-password-grant", ["exports", "ember-simple-auth/authenticators/base", "fetch", "ember-simple-auth/utils/is-fastboot"], function (_exports, _base, _fetch, _isFastboot) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;
  var assign = Ember.assign || Ember.merge;
  var keys = Object.keys || Ember.keys; // Ember.keys deprecated in 1.13

  /**
    Authenticator that conforms to OAuth 2
    ([RFC 6749](http://tools.ietf.org/html/rfc6749)), specifically the _"Resource
    Owner Password Credentials Grant Type"_.
  
    This authenticator also automatically refreshes access tokens (see
    [RFC 6749, section 6](http://tools.ietf.org/html/rfc6749#section-6)) if the
    server supports it.
  
    @class OAuth2PasswordGrantAuthenticator
    @module ember-simple-auth/authenticators/oauth2-password-grant
    @extends BaseAuthenticator
    @public
  */

  var _default = _base.default.extend({
    /**
      Triggered when the authenticator refreshed the access token (see
      [RFC 6749, section 6](http://tools.ietf.org/html/rfc6749#section-6)).
       @event sessionDataUpdated
      @param {Object} data The updated session data
      @public
    */

    /**
      The client_id to be sent to the authentication server (see
      https://tools.ietf.org/html/rfc6749#appendix-A.1). __This should only be
      used for statistics or logging etc. as it cannot actually be trusted since
      it could have been manipulated on the client!__
       @property clientId
      @type String
      @default null
      @public
    */
    clientId: null,

    /**
      The endpoint on the server that authentication and token refresh requests
      are sent to.
       @property serverTokenEndpoint
      @type String
      @default '/token'
      @public
    */
    serverTokenEndpoint: '/token',

    /**
      The endpoint on the server that token revocation requests are sent to. Only
      set this if the server actually supports token revocation. If this is
      `null`, the authenticator will not revoke tokens on session invalidation.
       __If token revocation is enabled but fails, session invalidation will be
      intercepted and the session will remain authenticated (see
      {{#crossLink "OAuth2PasswordGrantAuthenticator/invalidate:method"}}{{/crossLink}}).__
       @property serverTokenRevocationEndpoint
      @type String
      @default null
      @public
    */
    serverTokenRevocationEndpoint: null,

    /**
      Sets whether the authenticator automatically refreshes access tokens if the
      server supports it.
       @property refreshAccessTokens
      @type Boolean
      @default true
      @public
    */
    refreshAccessTokens: true,

    /**
      The offset time in milliseconds to refresh the access token. This must
      return a random number. This randomization is needed because in case of
      multiple tabs, we need to prevent the tabs from sending refresh token
      request at the same exact moment.
       __When overriding this property, make sure to mark the overridden property
      as volatile so it will actually have a different value each time it is
      accessed.__
       @property tokenRefreshOffset
      @type Integer
      @default a random number between 5 and 10
      @public
    */
    get tokenRefreshOffset() {
      var min = 5;
      var max = 10;
      return (Math.floor(Math.random() * (max - min)) + min) * 1000;
    },

    _refreshTokenTimeout: null,

    /**
      Restores the session from a session data object; __will return a resolving
      promise when there is a non-empty `access_token` in the session data__ and
      a rejecting promise otherwise.
       If the server issues
      [expiring access tokens](https://tools.ietf.org/html/rfc6749#section-5.1)
      and there is an expired access token in the session data along with a
      refresh token, the authenticator will try to refresh the access token and
      return a promise that resolves with the new access token if the refresh was
      successful. If there is no refresh token or the token refresh is not
      successful, a rejecting promise will be returned.
       @method restore
      @param {Object} data The data to restore the session from
      @return {Ember.RSVP.Promise} A promise that when it resolves results in the session becoming or remaining authenticated. If restoration fails, the promise will reject with the server response (in case the access token had expired and was refreshed using a refresh token); however, the authenticator reads that response already so if you need to read it again you need to clone the response object first
      @public
    */
    restore: function restore(data) {
      var _this = this;

      return new Ember.RSVP.Promise(function (resolve, reject) {
        var now = new Date().getTime();

        var refreshAccessTokens = _this.get('refreshAccessTokens');

        if (!Ember.isEmpty(data['expires_at']) && data['expires_at'] < now) {
          if (refreshAccessTokens) {
            _this._refreshAccessToken(data['expires_in'], data['refresh_token']).then(resolve, reject);
          } else {
            reject();
          }
        } else {
          if (!_this._validate(data)) {
            reject();
          } else {
            _this._scheduleAccessTokenRefresh(data['expires_in'], data['expires_at'], data['refresh_token']);

            resolve(data);
          }
        }
      });
    },

    /**
      Authenticates the session with the specified `identification`, `password`
      and optional `scope`; issues a `POST` request to the
      {{#crossLink "OAuth2PasswordGrantAuthenticator/serverTokenEndpoint:property"}}{{/crossLink}}
      and receives the access token in response (see
      http://tools.ietf.org/html/rfc6749#section-4.3).
       __If the credentials are valid (and the optionally requested scope is
      granted) and thus authentication succeeds, a promise that resolves with the
      server's response is returned__, otherwise a promise that rejects with the
      error as returned by the server is returned.
       __If the
      [server supports it](https://tools.ietf.org/html/rfc6749#section-5.1), this
      method also schedules refresh requests for the access token before it
      expires.__
       The server responses are expected to look as defined in the spec (see
      http://tools.ietf.org/html/rfc6749#section-5). The response to a successful
      authentication request should be:
       ```json
      HTTP/1.1 200 OK
      Content-Type: application/json;charset=UTF-8
       {
        "access_token":"2YotnFZFEjr1zCsicMWpAA",
        "token_type":"bearer",
        "expires_in":3600, // optional
        "refresh_token":"tGzv3JOkF0XG5Qx2TlKWIA" // optional
      }
      ```
       The response for a failing authentication request should be:
       ```json
      HTTP/1.1 400 Bad Request
      Content-Type: application/json;charset=UTF-8
       {
        "error":"invalid_grant"
      }
      ```
       A full list of error codes can be found
      [here](https://tools.ietf.org/html/rfc6749#section-5.2).
       @method authenticate
      @param {String} identification The resource owner username
      @param {String} password The resource owner password
      @param {String|Array} scope The scope of the access request (see [RFC 6749, section 3.3](http://tools.ietf.org/html/rfc6749#section-3.3))
      @param {Object} headers Optional headers that particular backends may require (for example sending 2FA challenge responses)
      @return {Ember.RSVP.Promise} A promise that when it resolves results in the session becoming authenticated. If authentication fails, the promise will reject with the server response; however, the authenticator reads that response already so if you need to read it again you need to clone the response object first
      @public
    */
    authenticate: function authenticate(identification, password) {
      var _this2 = this;

      var scope = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];
      var headers = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
      return new Ember.RSVP.Promise(function (resolve, reject) {
        var data = {
          'grant_type': 'password',
          username: identification,
          password: password
        };

        var serverTokenEndpoint = _this2.get('serverTokenEndpoint');

        var scopesString = Ember.makeArray(scope).join(' ');

        if (!Ember.isEmpty(scopesString)) {
          data.scope = scopesString;
        }

        _this2.makeRequest(serverTokenEndpoint, data, headers).then(function (response) {
          Ember.run(function () {
            if (!_this2._validate(response)) {
              reject('access_token is missing in server response');
            }

            var expiresAt = _this2._absolutizeExpirationTime(response['expires_in']);

            _this2._scheduleAccessTokenRefresh(response['expires_in'], expiresAt, response['refresh_token']);

            if (!Ember.isEmpty(expiresAt)) {
              response = assign(response, {
                'expires_at': expiresAt
              });
            }

            resolve(response);
          });
        }, function (response) {
          Ember.run(null, reject, response);
        });
      });
    },

    /**
      If token revocation is enabled, this will revoke the access token (and the
      refresh token if present). If token revocation succeeds, this method
      returns a resolving promise, otherwise it will return a rejecting promise,
      thus intercepting session invalidation.
       If token revocation is not enabled this method simply returns a resolving
      promise.
       @method invalidate
      @param {Object} data The current authenticated session data
      @return {Ember.RSVP.Promise} A promise that when it resolves results in the session being invalidated. If invalidation fails, the promise will reject with the server response (in case token revocation is used); however, the authenticator reads that response already so if you need to read it again you need to clone the response object first
      @public
    */
    invalidate: function invalidate(data) {
      var _this3 = this;

      var serverTokenRevocationEndpoint = this.get('serverTokenRevocationEndpoint');

      function success(resolve) {
        Ember.run.cancel(this._refreshTokenTimeout);
        delete this._refreshTokenTimeout;
        resolve();
      }

      return new Ember.RSVP.Promise(function (resolve) {
        if (Ember.isEmpty(serverTokenRevocationEndpoint)) {
          success.apply(_this3, [resolve]);
        } else {
          var requests = [];
          Ember.A(['access_token', 'refresh_token']).forEach(function (tokenType) {
            var token = data[tokenType];

            if (!Ember.isEmpty(token)) {
              requests.push(_this3.makeRequest(serverTokenRevocationEndpoint, {
                'token_type_hint': tokenType,
                token: token
              }));
            }
          });

          var succeed = function succeed() {
            success.apply(_this3, [resolve]);
          };

          Ember.RSVP.all(requests).then(succeed, succeed);
        }
      });
    },

    /**
      Makes a request to the OAuth 2.0 server.
       @method makeRequest
      @param {String} url The request URL
      @param {Object} data The request data
      @param {Object} headers Additional headers to send in request
      @return {Promise} A promise that resolves with the response object
      @protected
    */
    makeRequest: function makeRequest(url, data) {
      var headers = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
      headers['Content-Type'] = 'application/x-www-form-urlencoded';
      var clientId = this.get('clientId');

      if (!Ember.isEmpty(clientId)) {
        data['client_id'] = this.get('clientId');
      }

      var body = keys(data).map(function (key) {
        return "".concat(encodeURIComponent(key), "=").concat(encodeURIComponent(data[key]));
      }).join('&');
      var options = {
        body: body,
        headers: headers,
        method: 'POST'
      };
      return new Ember.RSVP.Promise(function (resolve, reject) {
        (0, _fetch.default)(url, options).then(function (response) {
          response.text().then(function (text) {
            try {
              var json = JSON.parse(text);

              if (!response.ok) {
                response.responseJSON = json;
                reject(response);
              } else {
                resolve(json);
              }
            } catch (SyntaxError) {
              response.responseText = text;
              reject(response);
            }
          });
        }).catch(reject);
      });
    },
    _scheduleAccessTokenRefresh: function _scheduleAccessTokenRefresh(expiresIn, expiresAt, refreshToken) {
      var refreshAccessTokens = this.get('refreshAccessTokens') && !(0, _isFastboot.default)(Ember.getOwner(this));

      if (refreshAccessTokens) {
        var now = new Date().getTime();

        if (Ember.isEmpty(expiresAt) && !Ember.isEmpty(expiresIn)) {
          expiresAt = new Date(now + expiresIn * 1000).getTime();
        }

        var offset = this.get('tokenRefreshOffset');

        if (!Ember.isEmpty(refreshToken) && !Ember.isEmpty(expiresAt) && expiresAt > now - offset) {
          Ember.run.cancel(this._refreshTokenTimeout);
          delete this._refreshTokenTimeout;

          if (!Ember.testing) {
            this._refreshTokenTimeout = Ember.run.later(this, this._refreshAccessToken, expiresIn, refreshToken, expiresAt - now - offset);
          }
        }
      }
    },
    _refreshAccessToken: function _refreshAccessToken(expiresIn, refreshToken) {
      var _this4 = this;

      var data = {
        'grant_type': 'refresh_token',
        'refresh_token': refreshToken
      };
      var serverTokenEndpoint = this.get('serverTokenEndpoint');
      return new Ember.RSVP.Promise(function (resolve, reject) {
        _this4.makeRequest(serverTokenEndpoint, data).then(function (response) {
          Ember.run(function () {
            expiresIn = response['expires_in'] || expiresIn;
            refreshToken = response['refresh_token'] || refreshToken;

            var expiresAt = _this4._absolutizeExpirationTime(expiresIn);

            var data = assign(response, {
              'expires_in': expiresIn,
              'expires_at': expiresAt,
              'refresh_token': refreshToken
            });

            _this4._scheduleAccessTokenRefresh(expiresIn, null, refreshToken);

            _this4.trigger('sessionDataUpdated', data);

            resolve(data);
          });
        }, function (response) {
          (true && Ember.warn("Access token could not be refreshed - server responded with ".concat(response.responseJSON, "."), false, {
            id: 'ember-simple-auth.failedOAuth2TokenRefresh'
          }));
          reject();
        });
      });
    },
    _absolutizeExpirationTime: function _absolutizeExpirationTime(expiresIn) {
      if (!Ember.isEmpty(expiresIn)) {
        return new Date(new Date().getTime() + expiresIn * 1000).getTime();
      }
    },
    _validate: function _validate(data) {
      return !Ember.isEmpty(data['access_token']);
    }
  });

  _exports.default = _default;
});
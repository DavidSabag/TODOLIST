define("ember-simple-auth/authenticators/devise", ["exports", "ember-simple-auth/authenticators/base", "fetch"], function (_exports, _base, _fetch) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;
  var assign = Ember.assign || Ember.merge;
  var JSON_CONTENT_TYPE = 'application/json';
  /**
    Authenticator that works with the Ruby gem
    [devise](https://github.com/plataformatec/devise).
  
    __As token authentication is not actually part of devise anymore, the server
    needs to implement some customizations__ to work with this authenticator -
    see [this gist](https://gist.github.com/josevalim/fb706b1e933ef01e4fb6).
  
    @class DeviseAuthenticator
    @module ember-simple-auth/authenticators/devise
    @extends BaseAuthenticator
    @public
  */

  var _default = _base.default.extend({
    /**
      The endpoint on the server that the authentication request is sent to.
       @property serverTokenEndpoint
      @type String
      @default '/users/sign_in'
      @public
    */
    serverTokenEndpoint: '/users/sign_in',

    /**
      The devise resource name. __This will be used in the request and also be
      expected in the server's response.__
       @property resourceName
      @type String
      @default 'user'
      @public
    */
    resourceName: 'user',

    /**
      The token attribute name. __This will be used in the request and also be
      expected in the server's response.__
       @property tokenAttributeName
      @type String
      @default 'token'
      @public
    */
    tokenAttributeName: 'token',

    /**
      The identification attribute name. __This will be used in the request and
      also be expected in the server's response.__
       @property identificationAttributeName
      @type String
      @default 'email'
      @public
    */
    identificationAttributeName: 'email',

    /**
      Restores the session from a session data object; __returns a resolving
      promise when there are non-empty
      {{#crossLink "DeviseAuthenticator/tokenAttributeName:property"}}token{{/crossLink}}
      and
      {{#crossLink "DeviseAuthenticator/identificationAttributeName:property"}}identification{{/crossLink}}
      values in `data`__ and a rejecting promise otherwise.
       @method restore
      @param {Object} data The data to restore the session from
      @return {Ember.RSVP.Promise} A promise that when it resolves results in the session becoming or remaining authenticated
      @public
    */
    restore: function restore(data) {
      // eslint-disable-next-line prefer-promise-reject-errors
      return this._validate(data) ? Ember.RSVP.Promise.resolve(data) : Ember.RSVP.Promise.reject();
    },

    /**
      Authenticates the session with the specified `identification` and
      `password`; the credentials are `POST`ed to the
      {{#crossLink "DeviseAuthenticator/serverTokenEndpoint:property"}}server{{/crossLink}}.
      If the credentials are valid the server will responds with a
      {{#crossLink "DeviseAuthenticator/tokenAttributeName:property"}}token{{/crossLink}}
      and
      {{#crossLink "DeviseAuthenticator/identificationAttributeName:property"}}identification{{/crossLink}}.
      __If the credentials are valid and authentication succeeds, a promise that
      resolves with the server's response is returned__, otherwise a promise that
      rejects with the server error is returned.
       @method authenticate
      @param {String} identification The user's identification
      @param {String} password The user's password
      @return {Ember.RSVP.Promise} A promise that when it resolves results in the session becoming authenticated. If authentication fails, the promise will reject with the server response; however, the authenticator reads that response already so if you need to read it again you need to clone the response object first
      @public
    */
    authenticate: function authenticate(identification, password) {
      var _this = this;

      return new Ember.RSVP.Promise(function (resolve, reject) {
        var _this$getProperties = _this.getProperties('resourceName', 'identificationAttributeName', 'tokenAttributeName'),
            resourceName = _this$getProperties.resourceName,
            identificationAttributeName = _this$getProperties.identificationAttributeName,
            tokenAttributeName = _this$getProperties.tokenAttributeName;

        var data = {};
        data[resourceName] = {
          password: password
        };
        data[resourceName][identificationAttributeName] = identification;

        _this.makeRequest(data).then(function (response) {
          if (response.ok) {
            response.json().then(function (json) {
              if (_this._validate(json)) {
                var _resourceName = _this.get('resourceName');

                var _json = json[_resourceName] ? json[_resourceName] : json;

                Ember.run(null, resolve, _json);
              } else {
                Ember.run(null, reject, "Check that server response includes ".concat(tokenAttributeName, " and ").concat(identificationAttributeName));
              }
            });
          } else {
            Ember.run(null, reject, response);
          }
        }).catch(function (error) {
          return Ember.run(null, reject, error);
        });
      });
    },

    /**
      Does nothing
       @method invalidate
      @return {Ember.RSVP.Promise} A resolving promise
      @public
    */
    invalidate: function invalidate() {
      return Ember.RSVP.Promise.resolve();
    },

    /**
      Makes a request to the Devise server using
      [ember-fetch](https://github.com/stefanpenner/ember-fetch).
       @method makeRequest
      @param {Object} data The request data
      @param {Object} options request options that are passed to `fetch`
      @return {Promise} The promise returned by `fetch`
      @protected
    */
    makeRequest: function makeRequest(data) {
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      var url = options.url || this.get('serverTokenEndpoint');
      var requestOptions = {};
      var body = JSON.stringify(data);
      assign(requestOptions, {
        body: body,
        method: 'POST',
        headers: {
          'accept': JSON_CONTENT_TYPE,
          'content-type': JSON_CONTENT_TYPE
        }
      });
      assign(requestOptions, options || {});
      return (0, _fetch.default)(url, requestOptions);
    },
    _validate: function _validate(data) {
      var tokenAttributeName = this.get('tokenAttributeName');
      var identificationAttributeName = this.get('identificationAttributeName');
      var resourceName = this.get('resourceName');

      var _data = data[resourceName] ? data[resourceName] : data;

      return !Ember.isEmpty(_data[tokenAttributeName]) && !Ember.isEmpty(_data[identificationAttributeName]);
    }
  });

  _exports.default = _default;
});
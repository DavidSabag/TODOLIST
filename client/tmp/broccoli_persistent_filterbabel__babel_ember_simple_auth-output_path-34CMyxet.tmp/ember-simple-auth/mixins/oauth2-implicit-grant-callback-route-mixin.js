define("ember-simple-auth/mixins/oauth2-implicit-grant-callback-route-mixin", ["exports", "ember-simple-auth/utils/location", "ember-simple-auth/utils/is-fastboot", "ember-simple-auth/authenticators/oauth2-implicit-grant"], function (_exports, _location, _isFastboot, _oauth2ImplicitGrant) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;
  (true && !(false) && Ember.deprecate("Ember Simple Auth: The OAuth2ImplicitGrantCallbackRouteMixin is now deprecated; call the session service's authenticate method with the appropriate authenticator in the respective route's activate method instead.", false, {
    id: 'ember-simple-auth.mixins.oauth2-implicit-grant-callback-route-mixin',
    until: '4.0.0'
  }));
  /**
    __This mixin is used in the callback route when using OAuth 2.0 Implicit
    Grant authentication.__ It implements the
    {{#crossLink "OAuth2ImplicitGrantCallbackRouteMixin/activate:method"}}{{/crossLink}}
    method that retrieves and processes authentication parameters, such as
    `access_token`, from the hash parameters provided in the callback URL by
    the authentication server. The parameters are then passed to the
    {{#crossLink "OAuth2ImplicitGrantAuthenticator"}}{{/crossLink}}
  
    @class OAuth2ImplicitGrantCallbackRouteMixin
    @deprecated Call the session service's authenticate method with the appropriate authenticator in the respective route's activate method instead
    @module ember-simple-auth/mixins/oauth2-implicit-grant-callback-route-mixin
    @extends Ember.Mixin
    @public
  */

  var _default = Ember.Mixin.create({
    /**
     The session service.
      @property session
     @readOnly
     @type SessionService
     @public
     */
    session: Ember.inject.service('session'),

    /**
      The authenticator that should be used to authenticate the callback. This
      must be a subclass of the
      {{#crossLink "OAuth2ImplicitGrantAuthenticator"}}{{/crossLink}}
      authenticator.
       @property authenticator
      @type String
      @default null
      @public
    */
    authenticator: null,

    /**
      Any error that potentially occurs during authentication will be stored in
      this property.
       @property error
      @type String
      @default null
      @public
    */
    error: null,

    /**
      Passes the hash received with the redirection from the authentication
      server to the
      {{#crossLink "OAuth2ImplicitGrantAuthenticator"}}{{/crossLink}} and
      authenticates the session with the authenticator.
       @method activate
      @public
    */
    activate: function activate() {
      var _this = this;

      var _isFastBoot = this.hasOwnProperty('_isFastBoot') ? this._isFastBoot : (0, _isFastboot.default)(Ember.getOwner(this));

      if (_isFastBoot) {
        return;
      }

      var authenticator = this.get('authenticator');
      var hash = (0, _oauth2ImplicitGrant.parseResponse)((0, _location.default)().hash);
      this.get('session').authenticate(authenticator, hash).catch(function (err) {
        _this.set('error', err);
      });
    }
  });

  _exports.default = _default;
});
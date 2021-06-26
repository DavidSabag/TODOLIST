define("ember-simple-auth/configuration", ["exports"], function (_exports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;
  var DEFAULTS = {
    rootURL: '',
    routeAfterAuthentication: 'index'
  };
  /**
    Ember Simple Auth's configuration object.
  
    @class Configuration
    @extends Object
    @module ember-simple-auth/configuration
    @public
  */

  var _default = {
    /**
      The root URL of the application as configured in `config/environment.js`.
       @property rootURL
      @readOnly
      @static
      @type String
      @default ''
      @public
    */
    rootURL: DEFAULTS.rootURL,

    /**
      The route to transition to after successful authentication.
       @property routeAfterAuthentication
      @readOnly
      @static
      @type String
      @default 'index'
      @public
    */
    routeAfterAuthentication: DEFAULTS.routeAfterAuthentication,
    load: function load(config) {
      this.rootURL = config.rootURL !== undefined ? config.rootURL : DEFAULTS.rootURL;
      this.routeAfterAuthentication = config.routeAfterAuthentication !== undefined ? config.routeAfterAuthentication : DEFAULTS.routeAfterAuthentication;
    }
  };
  _exports.default = _default;
});
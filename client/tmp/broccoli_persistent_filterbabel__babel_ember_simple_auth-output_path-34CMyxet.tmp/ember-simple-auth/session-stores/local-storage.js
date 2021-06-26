define("ember-simple-auth/session-stores/local-storage", ["exports", "ember-simple-auth/session-stores/base", "ember-simple-auth/utils/objects-are-equal", "ember-simple-auth/utils/is-fastboot"], function (_exports, _base, _objectsAreEqual, _isFastboot) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;

  /**
    Session store that persists data in the browser's `localStorage`.
  
    __`localStorage` is not available in Safari when running in private mode. In
    general it is better to use the
    {{#crossLink "AdaptiveStore"}}{{/crossLink}} that automatically falls back to
    the {{#crossLink "CookieStore"}}{{/crossLink}} when `localStorage` is not
    available.__
  
    __This session store does not work with FastBoot. In order to use Ember
    Simple Auth with FastBoot, configure the
    {{#crossLink "CookieStore"}}{{/crossLink}} as the application's session
    store.__
  
    @class LocalStorageStore
    @module ember-simple-auth/session-stores/local-storage
    @extends BaseStore
    @public
  */
  var _default = _base.default.extend({
    /**
      The `localStorage` key the store persists data in.
       @property key
      @type String
      @default 'ember_simple_auth-session'
      @public
    */
    key: 'ember_simple_auth-session',
    init: function init() {
      this._super.apply(this, arguments);

      this._isFastBoot = this.hasOwnProperty('_isFastBoot') ? this._isFastBoot : (0, _isFastboot.default)(Ember.getOwner(this));
      this._boundHandler = Ember.run.bind(this, this._handleStorageEvent);

      if (!this.get('_isFastBoot')) {
        window.addEventListener('storage', this._boundHandler);
      }
    },
    willDestroy: function willDestroy() {
      if (!this.get('_isFastBoot')) {
        window.removeEventListener('storage', this._boundHandler);
      }
    },

    /**
      Persists the `data` in the `localStorage`.
       @method persist
      @param {Object} data The data to persist
      @return {Ember.RSVP.Promise} A promise that resolves when the data has successfully been persisted and rejects otherwise.
      @public
    */
    persist: function persist(data) {
      this._lastData = data;
      data = JSON.stringify(data || {});
      localStorage.setItem(this.key, data);
      return Ember.RSVP.resolve();
    },

    /**
      Returns all data currently stored in the `localStorage` as a plain object.
       @method restore
      @return {Ember.RSVP.Promise} A promise that resolves with the data currently persisted in the store when the data has been restored successfully and rejects otherwise.
      @public
    */
    restore: function restore() {
      var data = localStorage.getItem(this.key);
      return Ember.RSVP.resolve(JSON.parse(data) || {});
    },

    /**
      Clears the store by deleting the
      {{#crossLink "LocalStorageStore/key:property"}}{{/crossLink}} from
      `localStorage`.
       @method clear
      @return {Ember.RSVP.Promise} A promise that resolves when the store has been cleared successfully and rejects otherwise.
      @public
    */
    clear: function clear() {
      localStorage.removeItem(this.key);
      this._lastData = {};
      return Ember.RSVP.resolve();
    },
    _handleStorageEvent: function _handleStorageEvent(e) {
      var _this = this;

      if (e.key === this.get('key')) {
        this.restore().then(function (data) {
          if (!(0, _objectsAreEqual.default)(data, _this._lastData)) {
            _this._lastData = data;

            _this.trigger('sessionDataUpdated', data);
          }
        });
      }
    }
  });

  _exports.default = _default;
});
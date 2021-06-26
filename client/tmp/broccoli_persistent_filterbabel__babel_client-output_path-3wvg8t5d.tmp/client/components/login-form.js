define('client/components/login-form', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  function _asyncToGenerator(fn) {
    return function () {
      var gen = fn.apply(this, arguments);
      return new Promise(function (resolve, reject) {
        function step(key, arg) {
          try {
            var info = gen[key](arg);
            var value = info.value;
          } catch (error) {
            reject(error);
            return;
          }

          if (info.done) {
            resolve(value);
          } else {
            return Promise.resolve(value).then(function (value) {
              step("next", value);
            }, function (err) {
              step("throw", err);
            });
          }
        }

        return step("next");
      });
    };
  }

  exports.default = Ember.Component.extend({
    session: Ember.inject.service('session'),

    actions: {
      authenticate: function () {
        var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
          var email, password;
          return regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) {
              switch (_context.prev = _context.next) {
                case 0:
                  _context.prev = 0;
                  email = this.email, password = this.password;
                  _context.next = 4;
                  return this.get('session').authenticate('authenticator:token', email, password);

                case 4:
                  _context.next = 9;
                  break;

                case 6:
                  _context.prev = 6;
                  _context.t0 = _context['catch'](0);

                  this.set('errorMessage', _context.t0);

                case 9:
                case 'end':
                  return _context.stop();
              }
            }
          }, _callee, this, [[0, 6]]);
        }));

        function authenticate() {
          return _ref.apply(this, arguments);
        }

        return authenticate;
      }(),
      updateEmail: function updateEmail(e) {
        this.set('email', e.target.value);
      },
      updatePassword: function updatePassword(e) {
        this.set('password', e.target.value);
      }
    }

  });
});
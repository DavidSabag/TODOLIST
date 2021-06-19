define('client/authenticators/token', ['exports', 'ember-simple-auth/authenticators/base', 'client/config/environment'], function (exports, _base, _environment) {
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

    exports.default = _base.default.extend({
        restore: function restore(data) {},
        authenticate: function () {
            var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(email, password) {
                var res, err;
                return regeneratorRuntime.wrap(function _callee$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                _context.next = 2;
                                return fetch(_environment.default.apiHost + '/login', {
                                    method: 'POST',
                                    headers: {
                                        'Content-Type': 'application/json'
                                    },
                                    body: JSON.stringify({
                                        email: email, password: password
                                    })
                                });

                            case 2:
                                res = _context.sent;

                                if (!res.ok) {
                                    _context.next = 8;
                                    break;
                                }

                                sessionStorage.setItem('user', email);
                                return _context.abrupt('return', res.json());

                            case 8:
                                _context.next = 10;
                                return res.json();

                            case 10:
                                err = _context.sent;
                                throw new Error(err.error);

                            case 12:
                            case 'end':
                                return _context.stop();
                        }
                    }
                }, _callee, this);
            }));

            function authenticate(_x, _x2) {
                return _ref.apply(this, arguments);
            }

            return authenticate;
        }(),
        invalidate: function invalidate(data) {}
    });
});
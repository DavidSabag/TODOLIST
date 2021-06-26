define('client/components/signup-form', ['exports', 'client/config/environment'], function (exports, _environment) {
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
            addUser: function () {
                var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(self) {
                    var email, addpassword, res, err;
                    return regeneratorRuntime.wrap(function _callee$(_context) {
                        while (1) {
                            switch (_context.prev = _context.next) {
                                case 0:
                                    email = self.email, addpassword = self.addpassword;
                                    _context.next = 3;
                                    return fetch(_environment.default.apiHost + '/adduser', {
                                        method: 'POST',
                                        headers: {
                                            'Content-Type': 'application/json'
                                        },
                                        body: JSON.stringify({
                                            email: email, addpassword: addpassword
                                        })
                                    });

                                case 3:
                                    res = _context.sent;

                                    if (!res.ok) {
                                        _context.next = 11;
                                        break;
                                    }

                                    self.set('success', res);
                                    self.set('email', '');
                                    self.set('addpassword', '');
                                    self.set('repassword', '');

                                    _context.next = 15;
                                    break;

                                case 11:
                                    _context.next = 13;
                                    return res.json();

                                case 13:
                                    err = _context.sent;

                                    self.set('errorMessage', err.error);

                                case 15:
                                case 'end':
                                    return _context.stop();
                            }
                        }
                    }, _callee, this);
                }));

                function addUser(_x) {
                    return _ref.apply(this, arguments);
                }

                return addUser;
            }(),
            checkEnterdPassword: function checkEnterdPassword() {
                var addpassword = this.addpassword,
                    repassword = this.repassword;

                if (addpassword !== repassword) {
                    this.set('errorMessage', 'Bad password input');
                } else {
                    this.actions.addUser(this);
                }
            },
            addEmail: function addEmail(e) {
                this.set('email', e.target.value);
            },
            addPassword: function addPassword(e) {
                this.set('addpassword', e.target.value);
            },
            rePassword: function rePassword(e) {
                this.set('repassword', e.target.value);
            }
        }

    });
});
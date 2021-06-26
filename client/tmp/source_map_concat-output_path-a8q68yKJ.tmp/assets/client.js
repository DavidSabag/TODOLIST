"use strict";



define('client/app', ['exports', 'client/resolver', 'ember-load-initializers', 'client/config/environment'], function (exports, _resolver, _emberLoadInitializers, _environment) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });


  var App = Ember.Application.extend({
    modulePrefix: _environment.default.modulePrefix,
    podModulePrefix: _environment.default.podModulePrefix,
    Resolver: _resolver.default
  });

  (0, _emberLoadInitializers.default)(App, _environment.default.modulePrefix);

  exports.default = App;
});
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
define('client/components/add-todo', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.Component.extend({});
});
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
define('client/components/todos-list', ['exports', 'client/config/environment'], function (exports, _environment) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });

    function _toConsumableArray(arr) {
        if (Array.isArray(arr)) {
            for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) {
                arr2[i] = arr[i];
            }

            return arr2;
        } else {
            return Array.from(arr);
        }
    }

    exports.default = Ember.Component.extend({
        init: function init() {
            this._super();
            this.getTasks();
            this.getAllUsers();
        },
        getAllUsers: function getAllUsers() {
            var _this = this;

            fetch(_environment.default.apiHost + '/getAllUsers').then(function (res) {
                return res.json();
            }).then(function (users) {
                var allUsers = users.allUsers.map(function (user) {
                    return {
                        email: user.email,
                        is_shared: false
                    };
                });
                _this.set('users', allUsers.filter(function (user) {
                    return user.email !== _this.user;
                }));
            }).catch(function (err) {
                return alert(err);
            });
        },
        getSharedWith: function getSharedWith(shares, users) {
            var newUsers = [];
            var isShares = false;
            if (shares.length === 0) {
                return users.map(function (user) {
                    return {
                        email: user.email,
                        is_shared: false
                    };
                });
            }
            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = users[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var user = _step.value;

                    isShares = false;
                    var _iteratorNormalCompletion2 = true;
                    var _didIteratorError2 = false;
                    var _iteratorError2 = undefined;

                    try {
                        for (var _iterator2 = shares[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                            var sh = _step2.value;

                            if (user.email === sh.shared_with) {
                                newUsers.push({
                                    email: user.email,
                                    is_shared: true
                                });
                                isShares = true;
                            }
                        }
                    } catch (err) {
                        _didIteratorError2 = true;
                        _iteratorError2 = err;
                    } finally {
                        try {
                            if (!_iteratorNormalCompletion2 && _iterator2.return) {
                                _iterator2.return();
                            }
                        } finally {
                            if (_didIteratorError2) {
                                throw _iteratorError2;
                            }
                        }
                    }

                    if (!isShares) {
                        newUsers.push(user);
                    }
                }
            } catch (err) {
                _didIteratorError = true;
                _iteratorError = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion && _iterator.return) {
                        _iterator.return();
                    }
                } finally {
                    if (_didIteratorError) {
                        throw _iteratorError;
                    }
                }
            }

            return newUsers;
        },
        getTasks: function getTasks() {
            var _this2 = this;

            this.set('user', sessionStorage.getItem('user'));
            var user = this.user;

            fetch(_environment.default.apiHost + '/getTasks/' + user).then(function (res) {
                return res.json();
            }).then(function (tasks) {
                _this2.set('tasks', tasks.todos);
                _this2.updateCounters();
            }).catch(function (err) {
                return alert(err);
            });
        },
        updateCounters: function updateCounters() {
            this.set('complited', this.tasks.filter(function (task) {
                return task.is_done === 1;
            }).length);
            this.set('uncomplited', this.tasks.length - this.complited);
            this.set('total', this.tasks.length);
        },

        actions: {
            logOut: function logOut() {
                window.location.reload();
            },
            toggleTask: function toggleTask(e) {
                var _this3 = this;

                var user = this.user;

                var task = e.target.nextElementSibling.innerHTML;
                fetch(_environment.default.apiHost + '/updateTask', {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        email: user,
                        todo: task
                    })
                }).then(function (res) {
                    return res.json();
                }).then(function (newTasks) {
                    _this3.set('tasks', [].concat(_toConsumableArray(newTasks)));
                    _this3.updateCounters();
                }).catch(function (err) {
                    return alert(err);
                });
            },
            onShare: function onShare(e) {
                var _this4 = this;

                var modal = this.element.getElementsByClassName('share-lst')[0];
                modal.style.display = "block";
                var taskToReflect = e.target.getAttribute('value');
                var is_done = e.target.getAttribute('is_done');
                this.set('taskToReflect', taskToReflect);
                this.set('is_done', is_done);
                var user = this.user;

                fetch(_environment.default.apiHost + '/getUsersShare/' + user + '/' + taskToReflect, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }).then(function (res) {
                    return res.json();
                }).then(function (res) {
                    var users = _this4.users;

                    var newUsers = _this4.getSharedWith(res.shares, users);
                    _this4.set('users', [].concat(_toConsumableArray(newUsers)));
                }).catch(function (err) {
                    return alert(err);
                });
            },
            addTodo: function addTodo() {
                var modal = this.element.getElementsByClassName('modal')[0];
                modal.style.display = "block";
            },
            onAddModalClose: function onAddModalClose() {
                var modal = this.element.getElementsByClassName('modal')[0];
                modal.style.display = "none";
            },
            onShareModalClose: function onShareModalClose() {
                var modal = this.element.getElementsByClassName('share-lst')[0];
                modal.style.display = "none";
            },
            addTask: function addTask() {
                var _this5 = this;

                var user = this.user;

                var value = this.$('#add-task-input')[0].value;

                fetch(_environment.default.apiHost + '/addtask', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        email: user,
                        todo: value
                    })
                }).then(function (res) {
                    return res.json();
                }).then(function (todo) {
                    var tasks = _this5.tasks;

                    tasks.push(todo);
                    _this5.set('tasks', [].concat(_toConsumableArray(tasks)));
                    _this5.$('#add-task-input')[0].value = "";
                    _this5.updateCounters();
                }).catch(function (err) {
                    return alert(err);
                });
            },
            removeTask: function removeTask(e) {
                var _this6 = this;

                var user = this.user;

                var task = e.target.getAttribute('value');
                fetch(_environment.default.apiHost + '/removeTask/' + user + '/' + task, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }).then(function (res) {
                    return res.json();
                }).then(function (newTasks) {
                    _this6.set('tasks', [].concat(_toConsumableArray(newTasks)));
                    _this6.updateCounters();
                }).catch(function (err) {
                    return alert(err);
                });
            },
            shareTask: function shareTask(e) {
                var _this7 = this;

                var shared_with = e.target.getAttribute('value'); //who
                var is_shared = e.target.checked;
                var taskToReflect = this.taskToReflect,
                    user = this.user,
                    is_done = this.is_done;

                fetch(_environment.default.apiHost + '/shareTask', {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        user: user, taskToReflect: taskToReflect, is_done: is_done, is_shared: is_shared, shared_with: shared_with

                    })
                }).then(function (res) {
                    return res.json();
                }).then(function (newTasks) {
                    _this7.set('tasks', [].concat(_toConsumableArray(newTasks)));
                }).catch(function (err) {
                    return alert(err);
                });
            }
        }

    });
});
define('client/components/welcome-page', ['exports', 'ember-welcome-page/components/welcome-page'], function (exports, _welcomePage) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _welcomePage.default;
    }
  });
});
define('client/helpers/app-version', ['exports', 'client/config/environment', 'ember-cli-app-version/utils/regexp'], function (exports, _environment, _regexp) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.appVersion = appVersion;
  function appVersion(_) {
    var hash = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    var version = _environment.default.APP.version;
    // e.g. 1.0.0-alpha.1+4jds75hf

    // Allow use of 'hideSha' and 'hideVersion' For backwards compatibility
    var versionOnly = hash.versionOnly || hash.hideSha;
    var shaOnly = hash.shaOnly || hash.hideVersion;

    var match = null;

    if (versionOnly) {
      if (hash.showExtended) {
        match = version.match(_regexp.versionExtendedRegExp); // 1.0.0-alpha.1
      }
      // Fallback to just version
      if (!match) {
        match = version.match(_regexp.versionRegExp); // 1.0.0
      }
    }

    if (shaOnly) {
      match = version.match(_regexp.shaRegExp); // 4jds75hf
    }

    return match ? match[0] : version;
  }

  exports.default = Ember.Helper.helper(appVersion);
});
define('client/helpers/pluralize', ['exports', 'ember-inflector/lib/helpers/pluralize'], function (exports, _pluralize) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _pluralize.default;
});
define('client/helpers/singularize', ['exports', 'ember-inflector/lib/helpers/singularize'], function (exports, _singularize) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _singularize.default;
});
define('client/initializers/app-version', ['exports', 'ember-cli-app-version/initializer-factory', 'client/config/environment'], function (exports, _initializerFactory, _environment) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });


  var name = void 0,
      version = void 0;
  if (_environment.default.APP) {
    name = _environment.default.APP.name;
    version = _environment.default.APP.version;
  }

  exports.default = {
    name: 'App Version',
    initialize: (0, _initializerFactory.default)(name, version)
  };
});
define('client/initializers/container-debug-adapter', ['exports', 'ember-resolver/resolvers/classic/container-debug-adapter'], function (exports, _containerDebugAdapter) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = {
    name: 'container-debug-adapter',

    initialize: function initialize() {
      var app = arguments[1] || arguments[0];

      app.register('container-debug-adapter:main', _containerDebugAdapter.default);
      app.inject('container-debug-adapter:main', 'namespace', 'application:main');
    }
  };
});
define('client/initializers/data-adapter', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = {
    name: 'data-adapter',
    before: 'store',
    initialize: function initialize() {}
  };
});
define('client/initializers/ember-data', ['exports', 'ember-data/setup-container', 'ember-data'], function (exports, _setupContainer) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = {
    name: 'ember-data',
    initialize: _setupContainer.default
  };
});
define('client/initializers/ember-simple-auth', ['exports', 'client/config/environment', 'ember-simple-auth/configuration', 'ember-simple-auth/initializers/setup-session', 'ember-simple-auth/initializers/setup-session-service', 'ember-simple-auth/initializers/setup-session-restoration'], function (exports, _environment, _configuration, _setupSession, _setupSessionService, _setupSessionRestoration) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = {
    name: 'ember-simple-auth',

    initialize: function initialize(registry) {
      var config = _environment.default['ember-simple-auth'] || {};
      config.rootURL = _environment.default.rootURL || _environment.default.baseURL;
      _configuration.default.load(config);

      (0, _setupSession.default)(registry);
      (0, _setupSessionService.default)(registry);
      (0, _setupSessionRestoration.default)(registry);
    }
  };
});
define('client/initializers/export-application-global', ['exports', 'client/config/environment'], function (exports, _environment) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.initialize = initialize;
  function initialize() {
    var application = arguments[1] || arguments[0];
    if (_environment.default.exportApplicationGlobal !== false) {
      var theGlobal;
      if (typeof window !== 'undefined') {
        theGlobal = window;
      } else if (typeof global !== 'undefined') {
        theGlobal = global;
      } else if (typeof self !== 'undefined') {
        theGlobal = self;
      } else {
        // no reasonable global, just bail
        return;
      }

      var value = _environment.default.exportApplicationGlobal;
      var globalName;

      if (typeof value === 'string') {
        globalName = value;
      } else {
        globalName = Ember.String.classify(_environment.default.modulePrefix);
      }

      if (!theGlobal[globalName]) {
        theGlobal[globalName] = application;

        application.reopen({
          willDestroy: function willDestroy() {
            this._super.apply(this, arguments);
            delete theGlobal[globalName];
          }
        });
      }
    }
  }

  exports.default = {
    name: 'export-application-global',

    initialize: initialize
  };
});
define('client/initializers/injectStore', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = {
    name: 'injectStore',
    before: 'store',
    initialize: function initialize() {}
  };
});
define('client/initializers/store', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = {
    name: 'store',
    after: 'ember-data',
    initialize: function initialize() {}
  };
});
define('client/initializers/transforms', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = {
    name: 'transforms',
    before: 'store',
    initialize: function initialize() {}
  };
});
define("client/instance-initializers/ember-data", ["exports", "ember-data/initialize-store-service"], function (exports, _initializeStoreService) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = {
    name: "ember-data",
    initialize: _initializeStoreService.default
  };
});
define('client/instance-initializers/ember-simple-auth', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = {
    name: 'ember-simple-auth',

    initialize: function initialize() {}
  };
});
define('client/resolver', ['exports', 'ember-resolver'], function (exports, _emberResolver) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _emberResolver.default;
});
define('client/router', ['exports', 'client/config/environment'], function (exports, _environment) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });


  var Router = Ember.Router.extend({
    location: _environment.default.locationType,
    rootURL: _environment.default.rootURL
  });

  Router.map(function () {
    this.route('login');
    this.route('todos');
    this.route('signup');
    return "";
  });

  exports.default = Router;
});
define('client/routes/application', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.Route.extend();
});
define('client/routes/index', ['exports'], function (exports) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.default = Ember.Route.extend({
        beforeModel: function beforeModel() {
            this.transitionTo('todos');
        }
    });
});
define('client/routes/login', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.Route.extend({
    session: Ember.inject.service(),

    beforeModel: function beforeModel() {
      this.get('session').prohibitAuthentication('index');
    }
  });
});
define('client/routes/signup', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.Route.extend({});
});
define('client/routes/todos', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.Route.extend({
    session: Ember.inject.service(),

    beforeModel: function beforeModel(transs) {
      this.get('session').requireAuthentication(transs, 'login');
    }
  });
});
define('client/services/ajax', ['exports', 'ember-ajax/services/ajax'], function (exports, _ajax) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _ajax.default;
    }
  });
});
define('client/services/cookies', ['exports', 'ember-cookies/services/cookies'], function (exports, _cookies) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _cookies.default;
});
define('client/services/session', ['exports', 'ember-simple-auth/services/session'], function (exports, _session) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _session.default;
});
define('client/session-stores/application', ['exports', 'ember-simple-auth/session-stores/adaptive'], function (exports, _adaptive) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _adaptive.default.extend();
});
define("client/templates/application", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "vpfz1sAy", "block": "{\"symbols\":[],\"statements\":[[0,\"\\n\"],[1,[18,\"outlet\"],false]],\"hasEval\":false}", "meta": { "moduleName": "client/templates/application.hbs" } });
});
define("client/templates/components/login-form", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "MwvWWYvY", "block": "{\"symbols\":[],\"statements\":[[4,\"link-to\",[\"signup\"],null,{\"statements\":[[0,\"    \"],[6,\"button\"],[9,\"class\",\"btn btn-link more\"],[7],[0,\"Sign up\"],[8],[0,\"\\n\"]],\"parameters\":[]},null],[0,\"  \\n  \"],[6,\"div\"],[9,\"class\",\"text-center\"],[7],[0,\"\\n    \"],[6,\"form\"],[9,\"class\",\"form-signin\"],[3,\"action\",[[19,0,[]],\"authenticate\"],[[\"on\"],[\"submit\"]]],[7],[0,\"\\n      \\n      \"],[6,\"h1\"],[9,\"class\",\"h3 mb-3 font-weight-normal\"],[7],[0,\"Please sign in\"],[8],[0,\"\\n      \"],[6,\"label\"],[9,\"for\",\"inputEmail\"],[9,\"class\",\"sr-only\"],[7],[0,\"Email address\"],[8],[0,\"\\n      \"],[6,\"input\"],[9,\"type\",\"email\"],[9,\"id\",\"inputEmail\"],[9,\"class\",\"form-control\"],[10,\"onchange\",[25,\"action\",[[19,0,[]],\"updateEmail\"],null],null],[10,\"value\",[19,0,[\"email\"]],null],[9,\"placeholder\",\"Email address\"],[9,\"required\",\"\"],[9,\"autofocus\",\"\"],[7],[8],[0,\"\\n      \"],[6,\"label\"],[9,\"for\",\"inputPassword\"],[9,\"class\",\"sr-only\"],[7],[0,\"Password\"],[8],[0,\"\\n      \"],[6,\"input\"],[9,\"type\",\"password\"],[9,\"id\",\"inputPassword\"],[9,\"class\",\"form-control\"],[10,\"onchange\",[25,\"action\",[[19,0,[]],\"updatePassword\"],null],null],[10,\"value\",[19,0,[\"password\"]],null],[9,\"placeholder\",\"Password\"],[9,\"required\",\"\"],[7],[8],[0,\"\\n      \\n      \"],[6,\"button\"],[9,\"class\",\"btn btn-lg btn-primary btn-block\"],[9,\"type\",\"submit\"],[7],[0,\"Sign in\"],[8],[0,\"\\n      \\n    \"],[8],[0,\"\\n  \"],[8],[0,\"\\n\"],[4,\"if\",[[20,[\"errorMessage\"]]],null,{\"statements\":[[0,\"  \"],[6,\"div\"],[9,\"class\",\"alert alert-danger\"],[9,\"data-test-error-message\",\"\"],[7],[0,\"\\n    \"],[6,\"p\"],[7],[0,\"\\n      \"],[6,\"strong\"],[7],[0,\"Sign in failed\"],[8],[6,\"br\"],[7],[8],[0,\" \"],[6,\"code\"],[7],[1,[18,\"errorMessage\"],false],[8],[0,\"\\n    \"],[8],[0,\"\\n   \\n  \"],[8],[0,\"\\n\"]],\"parameters\":[]},null]],\"hasEval\":false}", "meta": { "moduleName": "client/templates/components/login-form.hbs" } });
});
define("client/templates/components/signup-form", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "6zmCgrcO", "block": "{\"symbols\":[],\"statements\":[[4,\"link-to\",[\"login\"],null,{\"statements\":[[0,\"    \"],[6,\"button\"],[9,\"class\",\"btn btn-link more\"],[7],[0,\"Back to login\"],[8],[0,\"\\n\"]],\"parameters\":[]},null],[0,\"  \\n  \"],[6,\"div\"],[9,\"class\",\"text-center\"],[7],[0,\"\\n    \"],[6,\"form\"],[9,\"class\",\"form-signin\"],[3,\"action\",[[19,0,[]],\"checkEnterdPassword\"],[[\"on\"],[\"submit\"]]],[7],[0,\"\\n      \\n      \"],[6,\"h1\"],[9,\"class\",\"h3 mb-3 font-weight-normal\"],[7],[0,\"Please sign up\"],[8],[0,\"\\n      \"],[6,\"label\"],[9,\"for\",\"inputEmail\"],[9,\"class\",\"sr-only\"],[7],[0,\"Email address\"],[8],[0,\"\\n      \"],[6,\"input\"],[9,\"type\",\"email\"],[9,\"id\",\"inputEmail\"],[9,\"class\",\"form-control\"],[10,\"onchange\",[25,\"action\",[[19,0,[]],\"addEmail\"],null],null],[10,\"value\",[19,0,[\"email\"]],null],[9,\"placeholder\",\"Email address\"],[9,\"required\",\"\"],[9,\"autofocus\",\"\"],[7],[8],[0,\"\\n      \"],[6,\"label\"],[9,\"for\",\"inputPassword\"],[9,\"class\",\"sr-only\"],[7],[0,\"Enter Password\"],[8],[0,\"\\n      \"],[6,\"input\"],[9,\"type\",\"password\"],[9,\"id\",\"inputPassword\"],[9,\"class\",\"form-control first\"],[10,\"onchange\",[25,\"action\",[[19,0,[]],\"addPassword\"],null],null],[10,\"value\",[19,0,[\"addpassword\"]],null],[9,\"placeholder\",\"Enter password\"],[9,\"required\",\"\"],[7],[8],[0,\"\\n      \"],[6,\"label\"],[9,\"for\",\"reinputPassword\"],[9,\"class\",\"sr-only\"],[7],[0,\"Re-enter Password\"],[8],[0,\"\\n      \"],[6,\"input\"],[9,\"type\",\"password\"],[9,\"id\",\"reinputPassword\"],[9,\"class\",\"form-control\"],[10,\"onchange\",[25,\"action\",[[19,0,[]],\"rePassword\"],null],null],[10,\"value\",[19,0,[\"repassword\"]],null],[9,\"placeholder\",\"Re-enter password\"],[9,\"required\",\"\"],[7],[8],[0,\"\\n      \\n      \"],[6,\"button\"],[9,\"class\",\"btn btn-lg btn-primary btn-block\"],[9,\"type\",\"submit\"],[7],[0,\"Sign up\"],[8],[0,\"\\n      \\n    \"],[8],[0,\"\\n  \"],[8],[0,\"\\n\"],[4,\"if\",[[20,[\"errorMessage\"]]],null,{\"statements\":[[0,\"  \"],[6,\"div\"],[9,\"class\",\"alert alert-danger\"],[7],[0,\"\\n    \"],[6,\"p\"],[7],[0,\"\\n      \"],[6,\"strong\"],[7],[0,\"Sign up failed\"],[8],[6,\"br\"],[7],[8],[0,\" \"],[6,\"code\"],[7],[1,[18,\"errorMessage\"],false],[8],[0,\"\\n    \"],[8],[0,\"\\n   \\n  \"],[8],[0,\"\\n\"]],\"parameters\":[]},null],[4,\"if\",[[20,[\"success\"]]],null,{\"statements\":[[0,\"  \"],[6,\"div\"],[9,\"class\",\"alert alert-success\"],[7],[0,\"\\n    \"],[6,\"p\"],[7],[0,\"\\n      \"],[6,\"strong\"],[7],[0,\"Sign up success!\"],[8],[6,\"br\"],[7],[8],[0,\"\\n    \"],[8],[0,\"\\n   \\n  \"],[8],[0,\"\\n\"]],\"parameters\":[]},null]],\"hasEval\":false}", "meta": { "moduleName": "client/templates/components/signup-form.hbs" } });
});
define("client/templates/components/todos-list", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "mx62ptPW", "block": "{\"symbols\":[\"user\",\"task\"],\"statements\":[[0,\" \\n \"],[6,\"button\"],[10,\"onclick\",[25,\"action\",[[19,0,[]],\"logOut\"],null],null],[9,\"class\",\"btn btn-link more\"],[7],[0,\"Sign out\"],[8],[0,\"\\n \\n\\n\"],[6,\"div\"],[9,\"class\",\"container mt-5\"],[7],[0,\"\\n    \"],[6,\"div\"],[9,\"class\",\"d-flex justify-content-center row\"],[7],[0,\"\\n        \"],[6,\"div\"],[9,\"class\",\"col-md-6\"],[7],[0,\"\\n            \"],[6,\"div\"],[9,\"class\",\"p-4 bg-white notes\"],[7],[0,\"\\n                \"],[6,\"div\"],[9,\"class\",\"d-flex flex-row align-items-center notes-title between\"],[7],[0,\"\\n                    \"],[6,\"h4\"],[7],[0,\"My Todos\"],[8],[0,\"\\n                    \"],[6,\"h4\"],[10,\"onclick\",[25,\"action\",[[19,0,[]],\"addTodo\"],null],null],[9,\"class\",\"bi bi-plus-circle\"],[7],[8],[0,\"\\n                \"],[8],[0,\"\\n                \\n            \"],[8],[0,\"\\n            \"],[6,\"div\"],[9,\"class\",\"p-3 bg-white\"],[7],[0,\"\\n\"],[4,\"each\",[[19,0,[\"tasks\"]]],null,{\"statements\":[[0,\"                    \"],[6,\"div\"],[9,\"class\",\"d-flex align-items-center between\"],[7],[0,\"                      \\n                        \\n                            \"],[6,\"input\"],[10,\"checked\",[19,2,[\"is_done\"]],null],[9,\"type\",\"checkbox\"],[10,\"onchange\",[25,\"action\",[[19,0,[]],\"toggleTask\"],null],null],[9,\"class\",\"option-input radio\"],[7],[8],[0,\"\\n                            \"],[6,\"span\"],[10,\"class\",[25,\"if\",[[19,2,[\"is_done\"]],\"done\"],null],null],[7],[1,[19,2,[\"todo\"]],false],[8],[0,\"\\n                            \"],[6,\"div\"],[9,\"class\",\"todo-icons\"],[7],[0,\"\\n                                \"],[6,\"h4\"],[10,\"value\",[19,2,[\"todo\"]],null],[10,\"is_done\",[19,2,[\"is_done\"]],null],[10,\"onclick\",[25,\"action\",[[19,0,[]],\"onShare\"],null],null],[10,\"class\",[25,\"if\",[[19,2,[\"is_shared\"]],\"bi bi-share-fill\",\"bi bi-share\"],null],null],[7],[8],[0,\"\\n                                \"],[6,\"h4\"],[10,\"value\",[19,2,[\"todo\"]],null],[10,\"onclick\",[25,\"action\",[[19,0,[]],\"removeTask\"],null],null],[9,\"class\",\"bi bi-x-lg\"],[7],[8],[0,\"\\n                            \"],[8],[0,\"                \\n                    \\n                    \"],[8],[0,\"\\n\"]],\"parameters\":[2]},null],[0,\"                \\n            \"],[8],[0,\"\\n\\n        \"],[8],[0,\"\\n    \"],[8],[0,\"\\n    \\n\"],[8],[0,\"\\n\\n\\n\"],[6,\"div\"],[9,\"class\",\"modal\"],[7],[0,\"\\n    \"],[6,\"div\"],[9,\"class\",\"modal-content\"],[7],[0,\"\\n        \"],[6,\"span\"],[9,\"class\",\"close\"],[10,\"onclick\",[25,\"action\",[[19,0,[]],\"onAddModalClose\"],null],null],[7],[0,\"×\"],[8],[0,\"\\n            \"],[6,\"div\"],[9,\"class\",\"input-group mb-3\"],[7],[0,\"\\n                \"],[6,\"input\"],[9,\"id\",\"add-task-input\"],[9,\"type\",\"text\"],[9,\"class\",\"form-control\"],[10,\"value\",[19,0,[\"task\"]],null],[9,\"placeholder\",\"Describe your task here\"],[9,\"aria-label\",\"Recipient's username\"],[9,\"aria-describedby\",\"basic-addon2\"],[7],[8],[0,\"\\n                \"],[6,\"div\"],[9,\"class\",\"input-group-append\"],[7],[0,\"\\n                    \"],[6,\"button\"],[9,\"class\",\"btn btn-outline-secondary\"],[10,\"onclick\",[25,\"action\",[[19,0,[]],\"addTask\"],null],null],[9,\"type\",\"submit\"],[7],[0,\"Add Task\"],[8],[0,\"\\n                \"],[8],[0,\"\\n            \"],[8],[0,\"\\n    \"],[8],[0,\"\\n\"],[8],[0,\"\\n\\n\"],[6,\"div\"],[9,\"class\",\"share-lst\"],[7],[0,\"\\n    \\n    \"],[6,\"div\"],[9,\"class\",\"modal-content\"],[7],[0,\"\\n        \\n        \"],[6,\"span\"],[9,\"class\",\"close\"],[10,\"onclick\",[25,\"action\",[[19,0,[]],\"onShareModalClose\"],null],null],[7],[0,\"×\"],[8],[0,\"\\n            \"],[6,\"h5\"],[9,\"align\",\"center\"],[7],[0,\"Share task with\"],[8],[0,\"\\n\"],[4,\"each\",[[19,0,[\"users\"]]],null,{\"statements\":[[0,\"                \"],[6,\"div\"],[9,\"class\",\"input-group mb-3\"],[7],[0,\"\\n                    \"],[6,\"input\"],[10,\"value\",[19,1,[\"email\"]],null],[10,\"checked\",[19,1,[\"is_shared\"]],null],[10,\"onclick\",[25,\"action\",[[19,0,[]],\"shareTask\"],null],null],[9,\"type\",\"checkbox\"],[9,\"class\",\"option-input radio\"],[7],[8],[0,\" \\n                    \"],[6,\"label\"],[9,\"id\",\"share-user\"],[7],[1,[19,1,[\"email\"]],false],[8],[0,\"      \\n                \"],[8],[0,\"\\n\"]],\"parameters\":[1]},null],[0,\"            \\n    \"],[8],[0,\"\\n\"],[8],[0,\"\\n\\n\"],[6,\"footer\"],[9,\"class\",\"footer\"],[7],[0,\"\\n      \"],[6,\"div\"],[9,\"class\",\"containr\"],[7],[0,\"\\n        \"],[6,\"h4\"],[7],[0,\"Complited - \"],[1,[19,0,[\"complited\"]],false],[8],[0,\" \\n        \"],[6,\"h4\"],[7],[0,\"Uncomplited - \"],[1,[19,0,[\"uncomplited\"]],false],[8],[0,\"\\n        \"],[6,\"h4\"],[7],[0,\"Total - \"],[1,[19,0,[\"total\"]],false],[8],[0,\"\\n        \\n      \"],[8],[0,\"\\n\"],[8]],\"hasEval\":false}", "meta": { "moduleName": "client/templates/components/todos-list.hbs" } });
});
define("client/templates/login", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "yh8zzRd1", "block": "{\"symbols\":[],\"statements\":[[1,[18,\"login-form\"],false]],\"hasEval\":false}", "meta": { "moduleName": "client/templates/login.hbs" } });
});
define("client/templates/signup", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "nNcWe8LV", "block": "{\"symbols\":[],\"statements\":[[1,[18,\"signup-form\"],false]],\"hasEval\":false}", "meta": { "moduleName": "client/templates/signup.hbs" } });
});
define("client/templates/todos", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "wRX1KW7P", "block": "{\"symbols\":[],\"statements\":[[1,[18,\"todos-list\"],false]],\"hasEval\":false}", "meta": { "moduleName": "client/templates/todos.hbs" } });
});


define('client/config/environment', [], function() {
  var prefix = 'client';
try {
  var metaName = prefix + '/config/environment';
  var rawConfig = document.querySelector('meta[name="' + metaName + '"]').getAttribute('content');
  var config = JSON.parse(unescape(rawConfig));

  var exports = { 'default': config };

  Object.defineProperty(exports, '__esModule', { value: true });

  return exports;
}
catch(err) {
  throw new Error('Could not read config from meta tag with name "' + metaName + '".');
}

});

if (!runningTests) {
  require("client/app")["default"].create({"name":"client","version":"0.0.0+d90a9c90"});
}
//# sourceMappingURL=client.map

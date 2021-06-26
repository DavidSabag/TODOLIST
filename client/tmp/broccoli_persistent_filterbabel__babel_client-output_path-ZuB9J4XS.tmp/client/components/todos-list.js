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
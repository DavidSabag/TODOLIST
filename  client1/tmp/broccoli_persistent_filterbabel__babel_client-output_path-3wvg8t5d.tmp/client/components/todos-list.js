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
        },
        getTasks: function getTasks() {
            var _this = this;

            this.set('user', sessionStorage.getItem('user'));
            var user = this.user;

            fetch(_environment.default.apiHost + '/getTasks/' + user).then(function (res) {
                return res.json();
            }).then(function (tasks) {
                _this.set('tasks', tasks.todos);
            }).catch(function (err) {
                return alert(err);
            });
        },

        actions: {
            toggleTask: function toggleTask(e) {
                var _this2 = this;

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
                    _this2.set('tasks', [].concat(_toConsumableArray(newTasks)));
                }).catch(function (err) {
                    return alert(err);
                });
            },
            onShare: function onShare(e) {
                var _this3 = this;

                this.set('taskToReflect', e.target.getAttribute('value'));
                this.set('is_done', e.target.getAttribute('is_done'));
                var modal = this.element.getElementsByClassName('share-lst')[0];
                modal.style.display = "block";

                fetch(_environment.default.apiHost + '/getUsersShare/' + this.taskToReflect, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }).then(function (res) {
                    return res.json();
                }).then(function (res) {
                    _this3.set('users', res.shares.filter(function (s) {
                        return s.email !== _this3.user;
                    }));
                }).catch(function (err) {
                    return alert(err);
                });

                if (e.target.className.includes('fill')) {
                    e.target.className = 'bi bi-share';
                } else {
                    e.target.className = 'bi bi-share-fill';
                }
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
                var _this4 = this;

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
                    var tasks = _this4.tasks;

                    tasks.push(todo);
                    _this4.set('tasks', [].concat(_toConsumableArray(tasks)));
                    _this4.$('#add-task-input')[0].value = "";
                }).catch(function (err) {
                    return alert(err);
                });
            },
            removeTask: function removeTask(e) {
                var _this5 = this;

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
                    _this5.set('tasks', [].concat(_toConsumableArray(newTasks)));
                }).catch(function (err) {
                    return alert(err);
                });
            },
            shareTask: function shareTask(e) {
                var _this6 = this;

                var shared_with = e.target.getAttribute('value'); //who
                var taskToReflect = this.taskToReflect,
                    user = this.user,
                    is_done = this.is_done;


                fetch(_environment.default.apiHost + '/shareTask', {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        user: user, taskToReflect: taskToReflect, shared_with: shared_with, is_done: is_done

                    })
                }).then(function (res) {
                    return res.json();
                }).then(function (newTodos) {
                    _this6.set('todos', [].concat(_toConsumableArray(newTodos)));
                }).catch(function (err) {
                    return alert(err);
                });
            }
        }

    });
});
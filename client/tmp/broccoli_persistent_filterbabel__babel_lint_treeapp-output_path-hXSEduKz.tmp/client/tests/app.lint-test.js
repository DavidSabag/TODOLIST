define('client/tests/app.lint-test', [], function () {
  'use strict';

  QUnit.module('ESLint | app');

  QUnit.test('app.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'app.js should pass ESLint\n\n');
  });

  QUnit.test('authenticators/token.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'authenticators/token.js should pass ESLint\n\n');
  });

  QUnit.test('components/add-todo.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'components/add-todo.js should pass ESLint\n\n');
  });

  QUnit.test('components/login-form.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'components/login-form.js should pass ESLint\n\n');
  });

  QUnit.test('components/signup-form.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'components/signup-form.js should pass ESLint\n\n');
  });

  QUnit.test('components/todos-list.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'components/todos-list.js should pass ESLint\n\n');
  });

  QUnit.test('resolver.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'resolver.js should pass ESLint\n\n');
  });

  QUnit.test('router.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'router.js should pass ESLint\n\n');
  });

  QUnit.test('routes/index.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'routes/index.js should pass ESLint\n\n');
  });

  QUnit.test('routes/login.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'routes/login.js should pass ESLint\n\n');
  });

  QUnit.test('routes/signup.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'routes/signup.js should pass ESLint\n\n');
  });

  QUnit.test('routes/todos.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'routes/todos.js should pass ESLint\n\n');
  });
});
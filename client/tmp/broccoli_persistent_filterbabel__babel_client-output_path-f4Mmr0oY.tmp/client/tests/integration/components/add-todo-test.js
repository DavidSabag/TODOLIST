define('client/tests/integration/components/add-todo-test', ['ember-qunit'], function (_emberQunit) {
  'use strict';

  (0, _emberQunit.moduleForComponent)('add-todo', 'Integration | Component | add todo', {
    integration: true
  });

  (0, _emberQunit.test)('it renders', function (assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });

    this.render(Ember.HTMLBars.template({
      "id": "uRsBocGp",
      "block": "{\"symbols\":[],\"statements\":[[1,[18,\"add-todo\"],false]],\"hasEval\":false}",
      "meta": {}
    }));

    assert.equal(this.$().text().trim(), '');

    // Template block usage:
    this.render(Ember.HTMLBars.template({
      "id": "/g4MLBul",
      "block": "{\"symbols\":[],\"statements\":[[0,\"\\n\"],[4,\"add-todo\",null,null,{\"statements\":[[0,\"      template block text\\n\"]],\"parameters\":[]},null],[0,\"  \"]],\"hasEval\":false}",
      "meta": {}
    }));

    assert.equal(this.$().text().trim(), 'template block text');
  });
});
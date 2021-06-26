define('client/tests/integration/components/todos-list-test', ['ember-qunit'], function (_emberQunit) {
  'use strict';

  (0, _emberQunit.moduleForComponent)('todos-list', 'Integration | Component | todos list', {
    integration: true
  });

  (0, _emberQunit.test)('it renders', function (assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });

    this.render(Ember.HTMLBars.template({
      "id": "U14evF9P",
      "block": "{\"symbols\":[],\"statements\":[[1,[18,\"todos-list\"],false]],\"hasEval\":false}",
      "meta": {}
    }));

    assert.equal(this.$().text().trim(), '');

    // Template block usage:
    this.render(Ember.HTMLBars.template({
      "id": "R38xIXYS",
      "block": "{\"symbols\":[],\"statements\":[[0,\"\\n\"],[4,\"todos-list\",null,null,{\"statements\":[[0,\"      template block text\\n\"]],\"parameters\":[]},null],[0,\"  \"]],\"hasEval\":false}",
      "meta": {}
    }));

    assert.equal(this.$().text().trim(), 'template block text');
  });
});
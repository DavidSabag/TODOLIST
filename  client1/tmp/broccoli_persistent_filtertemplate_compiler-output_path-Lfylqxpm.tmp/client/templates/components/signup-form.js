export default Ember.HTMLBars.template({"id":"6zmCgrcO","block":"{\"symbols\":[],\"statements\":[[4,\"link-to\",[\"login\"],null,{\"statements\":[[0,\"    \"],[6,\"button\"],[9,\"class\",\"btn btn-link more\"],[7],[0,\"Back to login\"],[8],[0,\"\\n\"]],\"parameters\":[]},null],[0,\"  \\n  \"],[6,\"div\"],[9,\"class\",\"text-center\"],[7],[0,\"\\n    \"],[6,\"form\"],[9,\"class\",\"form-signin\"],[3,\"action\",[[19,0,[]],\"checkEnterdPassword\"],[[\"on\"],[\"submit\"]]],[7],[0,\"\\n      \\n      \"],[6,\"h1\"],[9,\"class\",\"h3 mb-3 font-weight-normal\"],[7],[0,\"Please sign up\"],[8],[0,\"\\n      \"],[6,\"label\"],[9,\"for\",\"inputEmail\"],[9,\"class\",\"sr-only\"],[7],[0,\"Email address\"],[8],[0,\"\\n      \"],[6,\"input\"],[9,\"type\",\"email\"],[9,\"id\",\"inputEmail\"],[9,\"class\",\"form-control\"],[10,\"onchange\",[25,\"action\",[[19,0,[]],\"addEmail\"],null],null],[10,\"value\",[19,0,[\"email\"]],null],[9,\"placeholder\",\"Email address\"],[9,\"required\",\"\"],[9,\"autofocus\",\"\"],[7],[8],[0,\"\\n      \"],[6,\"label\"],[9,\"for\",\"inputPassword\"],[9,\"class\",\"sr-only\"],[7],[0,\"Enter Password\"],[8],[0,\"\\n      \"],[6,\"input\"],[9,\"type\",\"password\"],[9,\"id\",\"inputPassword\"],[9,\"class\",\"form-control first\"],[10,\"onchange\",[25,\"action\",[[19,0,[]],\"addPassword\"],null],null],[10,\"value\",[19,0,[\"addpassword\"]],null],[9,\"placeholder\",\"Enter password\"],[9,\"required\",\"\"],[7],[8],[0,\"\\n      \"],[6,\"label\"],[9,\"for\",\"reinputPassword\"],[9,\"class\",\"sr-only\"],[7],[0,\"Re-enter Password\"],[8],[0,\"\\n      \"],[6,\"input\"],[9,\"type\",\"password\"],[9,\"id\",\"reinputPassword\"],[9,\"class\",\"form-control\"],[10,\"onchange\",[25,\"action\",[[19,0,[]],\"rePassword\"],null],null],[10,\"value\",[19,0,[\"repassword\"]],null],[9,\"placeholder\",\"Re-enter password\"],[9,\"required\",\"\"],[7],[8],[0,\"\\n      \\n      \"],[6,\"button\"],[9,\"class\",\"btn btn-lg btn-primary btn-block\"],[9,\"type\",\"submit\"],[7],[0,\"Sign up\"],[8],[0,\"\\n      \\n    \"],[8],[0,\"\\n  \"],[8],[0,\"\\n\"],[4,\"if\",[[20,[\"errorMessage\"]]],null,{\"statements\":[[0,\"  \"],[6,\"div\"],[9,\"class\",\"alert alert-danger\"],[7],[0,\"\\n    \"],[6,\"p\"],[7],[0,\"\\n      \"],[6,\"strong\"],[7],[0,\"Sign up failed\"],[8],[6,\"br\"],[7],[8],[0,\" \"],[6,\"code\"],[7],[1,[18,\"errorMessage\"],false],[8],[0,\"\\n    \"],[8],[0,\"\\n   \\n  \"],[8],[0,\"\\n\"]],\"parameters\":[]},null],[4,\"if\",[[20,[\"success\"]]],null,{\"statements\":[[0,\"  \"],[6,\"div\"],[9,\"class\",\"alert alert-success\"],[7],[0,\"\\n    \"],[6,\"p\"],[7],[0,\"\\n      \"],[6,\"strong\"],[7],[0,\"Sign up success!\"],[8],[6,\"br\"],[7],[8],[0,\"\\n    \"],[8],[0,\"\\n   \\n  \"],[8],[0,\"\\n\"]],\"parameters\":[]},null]],\"hasEval\":false}","meta":{"moduleName":"client/templates/components/signup-form.hbs"}});
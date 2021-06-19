export default Ember.HTMLBars.template({"id":"bi5iiP24","block":"{\"symbols\":[\"user\",\"task\"],\"statements\":[[6,\"div\"],[9,\"class\",\"container mt-5\"],[7],[0,\"\\n    \"],[6,\"div\"],[9,\"class\",\"d-flex justify-content-center row\"],[7],[0,\"\\n        \"],[6,\"div\"],[9,\"class\",\"col-md-6\"],[7],[0,\"\\n            \"],[6,\"div\"],[9,\"class\",\"p-4 bg-white notes\"],[7],[0,\"\\n                \"],[6,\"div\"],[9,\"class\",\"d-flex flex-row align-items-center notes-title between\"],[7],[0,\"\\n                    \"],[6,\"h4\"],[7],[0,\"My Todos\"],[8],[0,\"\\n                    \"],[6,\"h4\"],[10,\"onclick\",[25,\"action\",[[19,0,[]],\"addTodo\"],null],null],[9,\"class\",\"bi bi-plus-circle\"],[7],[8],[0,\"\\n                \"],[8],[0,\"\\n                \\n            \"],[8],[0,\"\\n            \"],[6,\"div\"],[9,\"class\",\"p-3 bg-white\"],[7],[0,\"\\n\"],[4,\"each\",[[19,0,[\"tasks\"]]],null,{\"statements\":[[0,\"                    \"],[6,\"div\"],[9,\"class\",\"d-flex align-items-center between\"],[7],[0,\"                      \\n                        \\n                            \"],[6,\"input\"],[10,\"checked\",[19,2,[\"is_done\"]],null],[9,\"type\",\"checkbox\"],[10,\"onchange\",[25,\"action\",[[19,0,[]],\"toggleTask\"],null],null],[9,\"class\",\"option-input radio\"],[7],[8],[0,\"\\n                            \"],[6,\"span\"],[10,\"class\",[25,\"if\",[[19,2,[\"is_done\"]],\"done\"],null],null],[7],[1,[19,2,[\"todo\"]],false],[8],[0,\"\\n                            \"],[6,\"div\"],[9,\"class\",\"todo-icons\"],[7],[0,\"\\n                                \"],[6,\"h4\"],[10,\"value\",[19,2,[\"todo\"]],null],[10,\"is_done\",[19,2,[\"is_done\"]],null],[10,\"onclick\",[25,\"action\",[[19,0,[]],\"onShare\"],null],null],[10,\"class\",[25,\"if\",[[19,2,[\"is_shared\"]],\"bi bi-share-fill\",\"bi bi-share\"],null],null],[7],[8],[0,\"\\n                                \"],[6,\"h4\"],[10,\"value\",[19,2,[\"todo\"]],null],[10,\"onclick\",[25,\"action\",[[19,0,[]],\"removeTask\"],null],null],[9,\"class\",\"bi bi-x-lg\"],[7],[8],[0,\"\\n                            \"],[8],[0,\"                \\n                    \\n                    \"],[8],[0,\"\\n\"]],\"parameters\":[2]},null],[0,\"                \\n            \"],[8],[0,\"\\n\\n        \"],[8],[0,\"\\n    \"],[8],[0,\"\\n    \\n\"],[8],[0,\"\\n\\n\\n\"],[6,\"div\"],[9,\"class\",\"modal\"],[7],[0,\"\\n    \"],[6,\"div\"],[9,\"class\",\"modal-content\"],[7],[0,\"\\n        \"],[6,\"span\"],[9,\"class\",\"close\"],[10,\"onclick\",[25,\"action\",[[19,0,[]],\"onAddModalClose\"],null],null],[7],[0,\"×\"],[8],[0,\"\\n            \"],[6,\"div\"],[9,\"class\",\"input-group mb-3\"],[7],[0,\"\\n                \"],[6,\"input\"],[9,\"id\",\"add-task-input\"],[9,\"type\",\"text\"],[9,\"class\",\"form-control\"],[10,\"value\",[19,0,[\"task\"]],null],[9,\"placeholder\",\"Describe your task here\"],[9,\"aria-label\",\"Recipient's username\"],[9,\"aria-describedby\",\"basic-addon2\"],[7],[8],[0,\"\\n                \"],[6,\"div\"],[9,\"class\",\"input-group-append\"],[7],[0,\"\\n                    \"],[6,\"button\"],[9,\"class\",\"btn btn-outline-secondary\"],[10,\"onclick\",[25,\"action\",[[19,0,[]],\"addTask\"],null],null],[9,\"type\",\"submit\"],[7],[0,\"Add Task\"],[8],[0,\"\\n                \"],[8],[0,\"\\n            \"],[8],[0,\"\\n    \"],[8],[0,\"\\n\"],[8],[0,\"\\n\\n\"],[6,\"div\"],[9,\"class\",\"share-lst\"],[7],[0,\"\\n    \\n    \"],[6,\"div\"],[9,\"class\",\"modal-content\"],[7],[0,\"\\n        \\n        \"],[6,\"span\"],[9,\"class\",\"close\"],[10,\"onclick\",[25,\"action\",[[19,0,[]],\"onShareModalClose\"],null],null],[7],[0,\"×\"],[8],[0,\"\\n            \"],[6,\"h5\"],[9,\"align\",\"center\"],[7],[0,\"Share task with\"],[8],[0,\"\\n\"],[4,\"each\",[[19,0,[\"users\"]]],null,{\"statements\":[[0,\"                \"],[6,\"div\"],[9,\"class\",\"input-group mb-3\"],[7],[0,\"\\n                    \"],[6,\"input\"],[10,\"value\",[19,1,[\"email\"]],null],[10,\"checked\",[19,1,[\"is_shared\"]],null],[10,\"onclick\",[25,\"action\",[[19,0,[]],\"shareTask\"],null],null],[9,\"type\",\"checkbox\"],[9,\"class\",\"option-input radio\"],[7],[8],[0,\" \\n                    \"],[6,\"label\"],[9,\"id\",\"share-user\"],[7],[1,[19,1,[\"email\"]],false],[8],[0,\"      \\n                \"],[8],[0,\"\\n\"]],\"parameters\":[1]},null],[0,\"            \\n    \"],[8],[0,\"\\n\"],[8],[0,\"\\n\\n\"]],\"hasEval\":false}","meta":{"moduleName":"client/templates/components/todos-list.hbs"}});
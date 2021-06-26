define("ember-simple-auth/utils/objects-are-equal", ["exports"], function (_exports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = objectsAreEqual;

  function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

  function objectsAreEqual(a, b) {
    function compare(x, y) {
      var property;

      if (isNaN(x) && isNaN(y) && typeof x === 'number' && typeof y === 'number') {
        return true;
      }

      if (x === y) {
        return true;
      }

      if (!(x instanceof Object && y instanceof Object)) {
        return false;
      }

      for (property in y) {
        if (y.hasOwnProperty(property) !== x.hasOwnProperty(property)) {
          return false;
        } else if (_typeof(y[property]) !== _typeof(x[property])) {
          return false;
        }
      }

      for (property in x) {
        if (y.hasOwnProperty(property) !== x.hasOwnProperty(property)) {
          return false;
        } else if (_typeof(y[property]) !== _typeof(x[property])) {
          return false;
        }

        switch (_typeof(x[property])) {
          case 'object':
            if (!compare(x[property], y[property])) {
              return false;
            }

            break;

          default:
            if (x[property] !== y[property]) {
              return false;
            }

            break;
        }
      }

      return true;
    }

    return compare(a, b);
  }
});
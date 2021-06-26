define('@ember/test-helpers/dom/double-click', ['exports', '@ember/test-helpers/dom/-get-element', '@ember/test-helpers/dom/fire-event', '@ember/test-helpers/dom/focus', '@ember/test-helpers/settled', '@ember/test-helpers/dom/-is-focusable', '@ember/test-helpers/-utils'], function (exports, _getElement, _fireEvent, _focus, _settled, _isFocusable, _utils) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.__doubleClick__ = __doubleClick__;
  exports.default = doubleClick;


  /**
    @private
    @param {Element} element the element to double-click on
    @param {Object} options the options to be merged into the mouse events
  */
  function __doubleClick__(element, options) {
    (0, _fireEvent.default)(element, 'mousedown', options);

    if ((0, _isFocusable.default)(element)) {
      (0, _focus.__focus__)(element);
    }

    (0, _fireEvent.default)(element, 'mouseup', options);
    (0, _fireEvent.default)(element, 'click', options);
    (0, _fireEvent.default)(element, 'mousedown', options);
    (0, _fireEvent.default)(element, 'mouseup', options);
    (0, _fireEvent.default)(element, 'click', options);
    (0, _fireEvent.default)(element, 'dblclick', options);
  }

  /**
    Double-clicks on the specified target.
  
    Sends a number of events intending to simulate a "real" user clicking on an
    element.
  
    For non-focusable elements the following events are triggered (in order):
  
    - `mousedown`
    - `mouseup`
    - `click`
    - `mousedown`
    - `mouseup`
    - `click`
    - `dblclick`
  
    For focusable (e.g. form control) elements the following events are triggered
    (in order):
  
    - `mousedown`
    - `focus`
    - `focusin`
    - `mouseup`
    - `click`
    - `mousedown`
    - `mouseup`
    - `click`
    - `dblclick`
  
    The exact listing of events that are triggered may change over time as needed
    to continue to emulate how actual browsers handle clicking a given element.
  
    Use the `options` hash to change the parameters of the MouseEvents. 
  
    @public
    @param {string|Element} target the element or selector to double-click on
    @param {Object} options the options to be merged into the mouse events
    @return {Promise<void>} resolves when settled
  */
  function doubleClick(target) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    return (0, _utils.nextTickPromise)().then(function () {
      if (!target) {
        throw new Error('Must pass an element or selector to `doubleClick`.');
      }

      var element = (0, _getElement.default)(target);
      if (!element) {
        throw new Error('Element not found when calling `doubleClick(\'' + target + '\')`.');
      }

      __doubleClick__(element, options);
      return (0, _settled.default)();
    });
  }
});
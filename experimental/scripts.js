// document.getElementsByTagName("BODY")[0]
var body = document.body;
var mainContentWrapper = document.getElementById("main-content-wrapper");

if (window.location.search.indexOf('mode=DEMO') > -1) {
    // More advanced method: https://gomakethings.com/getting-all-query-string-values-from-a-url-with-vanilla-js/
    body.classList.add("demo");
    mainContentWrapper.insertAdjacentHTML('afterend', '<button id="debug-template" type="button" style="display: none;" onclick="debugTemplate()">Toggle Debug</button>');
    mainContentWrapper.insertAdjacentHTML('afterend', '<button id="visualize-layout" type="button" style="display: none;" onclick="visualizeLayout()">Visualize Layout</button>');
}

function debugTemplate() {
    body.classList.toggle("debug");
    body.classList.remove("visualize-layout");
}

function visualizeLayout() {
    body.classList.toggle("visualize-layout");
    body.classList.remove("debug");
}

/************************************
 * VISIBILITY
 * Author: Jason Farrell
 * Author URI: http://useallfive.com/
 * Description: Checks if a DOM element is truly visible.
 * Package URL: https://github.com/UseAllFive/true-visibility
 ***********************************/
Element.prototype.isVisible = function() {

    'use strict';

    /**
     * Checks if a DOM element is visible. Takes into
     * consideration its parents and overflow.
     *
     * @param (el)      the DOM element to check if is visible
     *
     * These params are optional that are sent in recursively,
     * you typically won't use these:
     *
     * @param (t)       Top corner position number
     * @param (r)       Right corner position number
     * @param (b)       Bottom corner position number
     * @param (l)       Left corner position number
     * @param (w)       Element width number
     * @param (h)       Element height number
     */
    function _isVisible(el, t, r, b, l, w, h) {
        var p = el.parentNode,
                VISIBLE_PADDING = 2;

        if ( !_elementInDocument(el) ) {
            return false;
        }

        //-- Return true for document node
        if ( 9 === p.nodeType ) {
            return true;
        }

        //-- Return false if our element is invisible
        if (
             '0' === _getStyle(el, 'opacity') ||
             'none' === _getStyle(el, 'display') ||
             'hidden' === _getStyle(el, 'visibility')
        ) {
            return false;
        }

        if (
            'undefined' === typeof(t) ||
            'undefined' === typeof(r) ||
            'undefined' === typeof(b) ||
            'undefined' === typeof(l) ||
            'undefined' === typeof(w) ||
            'undefined' === typeof(h)
        ) {
            t = el.offsetTop;
            l = el.offsetLeft;
            b = t + el.offsetHeight;
            r = l + el.offsetWidth;
            w = el.offsetWidth;
            h = el.offsetHeight;
        }
        //-- If we have a parent, let's continue:
        if ( p ) {
            //-- Check if the parent can hide its children.
            if ( ('hidden' === _getStyle(p, 'overflow') || 'scroll' === _getStyle(p, 'overflow')) ) {
                //-- Only check if the offset is different for the parent
                if (
                    //-- If the target element is to the right of the parent elm
                    l + VISIBLE_PADDING > p.offsetWidth + p.scrollLeft ||
                    //-- If the target element is to the left of the parent elm
                    l + w - VISIBLE_PADDING < p.scrollLeft ||
                    //-- If the target element is under the parent elm
                    t + VISIBLE_PADDING > p.offsetHeight + p.scrollTop ||
                    //-- If the target element is above the parent elm
                    t + h - VISIBLE_PADDING < p.scrollTop
                ) {
                    //-- Our target element is out of bounds:
                    return false;
                }
            }
            //-- Add the offset parent's left/top coords to our element's offset:
            if ( el.offsetParent === p ) {
                l += p.offsetLeft;
                t += p.offsetTop;
            }
            //-- Let's recursively check upwards:
            return _isVisible(p, t, r, b, l, w, h);
        }
        return true;
    }

    //-- Cross browser method to get style properties:
    function _getStyle(el, property) {
        if ( window.getComputedStyle ) {
            return document.defaultView.getComputedStyle(el,null)[property];
        }
        if ( el.currentStyle ) {
            return el.currentStyle[property];
        }
    }

    function _elementInDocument(element) {
        while (element = element.parentNode) {
            if (element == document) {
                    return true;
            }
        }
        return false;
    }

    return _isVisible(this);

};

/************************************
 * EN HELPER SCRIPTS
 ***********************************/

  var field_wrapper_error_class = 'en__field__error-wrapper';
  var field_error_class = 'en__field__error';
  var submit_button_selector = '.en__submit button';

  window.isSplitField = function(field) {
    return (
      field.classList.contains('en__field__element--splittext') ||
      field.classList.contains('en__field__element--tripletext') ||
      field.classList.contains('en__field__element--splitselect') ||
      field.classList.contains('en__field__element--tripleselect')      
    );
  }

  window.isMultipleChoiceField = function(field) {
    return (
      field.classList.contains('en__field__element--radio') ||
      field.classList.contains('en__field__element--checkbox')
    );
  }

  window.getFieldWrapper = function(field) {
    if(window.isSplitField(field.parentNode.parentNode) || window.isMultipleChoiceField(field.parentNode.parentNode)) {
      return field.parentNode.parentNode.parentNode;
    } else {
      return field.parentNode.parentNode;
    }
  }

  window.clearAllErrors = function(element) {
    var existing_errors = element.querySelectorAll('.'+field_error_class);
    for(i = 0; i < existing_errors.length; i++) {      
      existing_errors[i].parentNode.classList.remove(field_wrapper_error_class);
      existing_errors[i].parentNode.removeChild(existing_errors[i]);
    }
  }

  window.clearError = function(field) {
    clearAllErrors(getFieldWrapper(field));
  }

  window.setError = function(field, message) {
    var field_wrapper = getFieldWrapper(field);

    var existing_errors = field_wrapper.getElementsByClassName(field_error_class);
    if(existing_errors.length) return;

    var errorNode = document.createElement('div');
    errorNode.className = field_error_class;
    errorNode.textContent = message;

    field_wrapper.appendChild(errorNode);
    field_wrapper.classList.add(field_wrapper_error_class);
  }

  window.isValidField = function(field) {
    return (field.value) ? true : false;
  }

  window.validateField = function(field, message) {
    if(!field) {
      return true;
    }
    if(!isValidField(field)) {
      if(!message) {
        var label = getFieldWrapper(field).getElementsByTagName('label')[0];
        message = label.textContent + ' must be provided';
      }
      setError(field, message);
      return false;
    } else {
      if(field.type !== 'hidden') {
        clearError(field);
      }
      return true;
    }    
  }

  window.validateFieldByName = function(field_name, message) {
    return validateField(document.querySelector('input[name="' + field_name + '"]'), message);
  }

  window.validateFieldById = function(field_id, message) {
    return validateField(document.getElementById(field_id), message);
  }

  window.attachAutomatedErrorWrappers = function(element) {
    var observer = new MutationObserver(function(mutations) {
      mutations.forEach(function(mutation) {
        for(var i = 0; i < mutation.addedNodes.length; i++) {
          if(mutation.addedNodes[i].className == field_error_class) {
            mutation.addedNodes[i].parentNode.classList.add(field_wrapper_error_class);
          }
        }
        for(var i = 0; i < mutation.removedNodes.length; i++) {
          if(mutation.removedNodes[i].className == field_error_class) {
            mutation.target.classList.remove(field_wrapper_error_class);
          }
        }
      });
    });
    observer.observe(element, { childList: true });
  }

  window.clearErrorOnInputHandler = function(element) {
    element.addEventListener('focus', function(e) {
      window.clearError(this);
      document.querySelector(submit_button_selector).disabled = false;      
    });
  }

/************************************
 * INPUT AND TEXTAREA ACTIVITY CLASSES (FOCUS AND BLUR)
 * REF: https://developer.mozilla.org/en-US/docs/Web/API/Element/blur_event
 ***********************************/

const enInput = (() => {

// add has-value class
const handleFocus = (e) => {
    const target = e.target;
    const targetWrapper = target.parentNode.parentNode;
    targetWrapper.classList.add('has-value');
    // targetWrapper.classList.remove('en__field--validationFailed');
    // targetWrapper.classList.add('en__field--validationNeeded');
    // targetWrapper.removeChild(targetWrapper.firstChild);
    // target.setAttribute('placeholder', target.getAttribute('data-placeholder'));
};

// remove has-value class
const handleBlur = (e) => {
    const target = e.target;
    const targetWrapper = target.parentNode.parentNode;

    if(target.value) {
        targetWrapper.classList.add('has-value');
    }else{
        targetWrapper.classList.remove('has-value');
    }
};

// register events
const bindEvents = (element) => {
    const floatField = element.querySelector('input, textarea');
    floatField.addEventListener('focus', handleFocus);
    floatField.addEventListener('blur', handleBlur);    
};

// get DOM elements
const init = () => {
    const floatContainers = document.querySelectorAll('.en__field--text, .en__field--textarea');

    floatContainers.forEach((element) => {

        if (element.querySelector('input, textarea').value) {
            element.parentNode.parentNode.classList.add('has-value');
        }

    bindEvents(element);
    });
};

return {
    init: init
};
})();

enInput.init();
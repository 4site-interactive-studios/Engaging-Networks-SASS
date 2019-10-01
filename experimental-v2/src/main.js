const body = document.body;
const mainContentWrapper = document.getElementById("main-content-wrapper");

if (window.location.search.indexOf("mode=DEMO") > -1) {
  // More advanced method: https://gomakethings.com/getting-all-query-string-values-from-a-url-with-vanilla-js/
  body.classList.add("demo");
  mainContentWrapper.insertAdjacentHTML(
    "afterend",
    '<button id="debug-template" type="button" style="display: none;" onclick="debugTemplate()">Toggle Debug</button>'
  );
  mainContentWrapper.insertAdjacentHTML(
    "afterend",
    '<button id="visualize-layout" type="button" style="display: none;" onclick="visualizeLayout()">Visualize Layout</button>'
  );
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
 * EN HELPER SCRIPTS
 ***********************************/

var field_wrapper_error_class = "en__field__error-wrapper";
var field_error_class = "en__field__error";
var submit_button_selector = ".en__submit button";

window.isSplitField = function(field) {
  return (
    field.classList.contains("en__field__element--splittext") ||
    field.classList.contains("en__field__element--tripletext") ||
    field.classList.contains("en__field__element--splitselect") ||
    field.classList.contains("en__field__element--tripleselect")
  );
};

window.isMultipleChoiceField = function(field) {
  return (
    field.classList.contains("en__field__element--radio") ||
    field.classList.contains("en__field__element--checkbox")
  );
};

window.getFieldWrapper = function(field) {
  if (
    window.isSplitField(field.parentNode.parentNode) ||
    window.isMultipleChoiceField(field.parentNode.parentNode)
  ) {
    return field.parentNode.parentNode.parentNode;
  } else {
    return field.parentNode.parentNode;
  }
};

window.clearAllErrors = function(element) {
  var existing_errors = element.querySelectorAll("." + field_error_class);
  for (i = 0; i < existing_errors.length; i++) {
    existing_errors[i].parentNode.classList.remove(field_wrapper_error_class);
    existing_errors[i].parentNode.removeChild(existing_errors[i]);
  }
};

window.clearError = function(field) {
  clearAllErrors(getFieldWrapper(field));
};

window.setError = function(field, message) {
  var field_wrapper = getFieldWrapper(field);

  var existing_errors = field_wrapper.getElementsByClassName(field_error_class);
  if (existing_errors.length) return;

  var errorNode = document.createElement("div");
  errorNode.className = field_error_class;
  errorNode.textContent = message;

  field_wrapper.appendChild(errorNode);
  field_wrapper.classList.add(field_wrapper_error_class);
};

window.isValidField = function(field) {
  return field.value ? true : false;
};

window.validateField = function(field, message) {
  if (!field) {
    return true;
  }
  if (!isValidField(field)) {
    if (!message) {
      var label = getFieldWrapper(field).getElementsByTagName("label")[0];
      message = label.textContent + " must be provided";
    }
    setError(field, message);
    return false;
  } else {
    if (field.type !== "hidden") {
      clearError(field);
    }
    return true;
  }
};

window.validateFieldByName = function(field_name, message) {
  return validateField(
    document.querySelector('input[name="' + field_name + '"]'),
    message
  );
};

window.validateFieldById = function(field_id, message) {
  return validateField(document.getElementById(field_id), message);
};

window.attachAutomatedErrorWrappers = function(element) {
  var observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
      for (var i = 0; i < mutation.addedNodes.length; i++) {
        if (mutation.addedNodes[i].className == field_error_class) {
          mutation.addedNodes[i].parentNode.classList.add(
            field_wrapper_error_class
          );
        }
      }
      for (var i = 0; i < mutation.removedNodes.length; i++) {
        if (mutation.removedNodes[i].className == field_error_class) {
          mutation.target.classList.remove(field_wrapper_error_class);
        }
      }
    });
  });
  observer.observe(element, {
    childList: true
  });
};

window.clearErrorOnInputHandler = function(element) {
  element.addEventListener("focus", function(e) {
    window.clearError(this);
    document.querySelector(submit_button_selector).disabled = false;
  });
};

/************************************
 * INPUT, TEXTAREA, AND SELECT ACTIVITY CLASSES (FOCUS AND BLUR)
 * NOTE: STILL NEEDS WORK TO FUNCTION ON "SPLIT" CUSTOM EN FIELDS
 * REF: https://developer.mozilla.org/en-US/docs/Web/API/Element/blur_event
 ***********************************/

const enInput = (() => {
  const handleFocus = e => {
    const target = e.target;
    const targetWrapper = target.parentNode.parentNode;
    targetWrapper.classList.add("has-focus");
  };

  const handleBlur = e => {
    const target = e.target;
    const targetWrapper = target.parentNode.parentNode;
    targetWrapper.classList.remove("has-focus");

    if (target.value) {
      targetWrapper.classList.add("has-value");
    } else {
      targetWrapper.classList.remove("has-value");
    }
  };

  const handleInput = e => {
    const target = e.target;
    const targetWrapper = target.parentNode.parentNode;
    targetWrapper.classList.add("has-value");
  };

  const handleChange = e => {
    const target = e.target;
    const targetWrapper = target.parentNode.parentNode;
    targetWrapper.classList.add("has-value");
  };

  // Handle Browser Autofill
  const onAutoFillStart = e =>
    e.parentNode.parentNode.classList.add("is-autofilled", "has-value");
  const onAutoFillCancel = e =>
    e.parentNode.parentNode.classList.remove("is-autofilled", "has-value");
  const onAnimationStart = ({ target, animationName }) => {
    switch (animationName) {
      case "onAutoFillStart":
        return onAutoFillStart(target);
      case "onAutoFillCancel":
        return onAutoFillCancel(target);
    }
  };

  // register events
  const bindEvents = element => {
    const enField = element.querySelector("input, textarea, select");
    enField.addEventListener("focus", handleFocus);
    enField.addEventListener("blur", handleBlur);
    enField.addEventListener("change", handleChange);
    enField.addEventListener("input", handleInput);
    enField.addEventListener("animationstart", onAnimationStart, false);
  };

  // get DOM elements
  const init = () => {
    const formInput = document.querySelectorAll(
      ".en__field--text, .en__field--textarea, .en__field--select"
    );
    formInput.forEach(element => {
      if (element.querySelector("input, textarea, select").value) {
        element.parentNode.parentNode.classList.add("has-value");
      }
      bindEvents(element);
    });
  };

  return {
    init: init
  };
})();

enInput.init();

/* Automatically select other radio input when an amount is entered into it. */
(function() {
  for (
    var e = document.querySelectorAll(
        ".en__field__input--other"
      ),
      t = 0;
    t < e.length;
    t++
  )
    e[t].addEventListener("focus", function(e) {
      this.parentNode.classList.remove('en__field__item--hidden');
      this.parentNode.parentNode.querySelector(
        ".en__field__item:nth-last-child(2) input"
      ).checked = !0;
    });
})();
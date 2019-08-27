/************************************
 * Template: 4Site Template - Parent Theme Base
 ***********************************/

/************************************
 * Loaders
 ***********************************/

document.addEventListener("DOMContentLoaded", domHasLoaded, false);
window.addEventListener("load", pageHasLoaded, false);

/*****************************
 * Provides a function for returning the value of a URL parameter
 * e.g. var id = getUrlParam('en-auto-submit');
 ****************************/
function getUrlParam(name) {
  var results = new RegExp("[\\?&]" + name + "=([^&#]*)").exec(
    window.location.href
  );
  return (results && results[1]) || undefined;
}

/*****************************
 * Element.matches() polyfill
 ****************************/
if (!Element.prototype.matches) {
  Element.prototype.matches =
    Element.prototype.msMatchesSelector ||
    Element.prototype.webkitMatchesSelector;
}

/*****************************
 * RENDER CRITICAL: PAGE BANNER
 ****************************/

(function() {
  window.addEventListener("DOMContentLoaded", function() {
    // Adds ".remove()" to add support for IE11
    // Create Element.remove() function if not exist
    // https://stackoverflow.com/questions/20428877/javascript-remove-doesnt-work-in-ie
    if (!("remove" in Element.prototype)) {
      Element.prototype.remove = function() {
        if (this.parentNode) {
          this.parentNode.removeChild(this);
        }
      };
    }

    // .header-image has one image in it, get its URL and set .banner's background-image property to it
    var headerImage = document.querySelector(".banner-image img");

    if (headerImage) {
      var headerImageSrc = headerImage.src;
      document.querySelector(".banner-image").remove();
      document.querySelector(".banner").style.backgroundImage =
        "url(" + headerImageSrc + ")";
    }
  });
})();

/*****************************
 * RENDER CRITICAL: DONATION VALUE TOGGLE
 ****************************/

(function() {
  window.addEventListener("oc_en_helpers_loaded", function() {
    var select_other_if_amount_not_found = false;

    var donate_amount_name = "transaction.donationAmt";
    var donate_amount_other_name = "transaction.donationAmt.other";
    var payment_frequency_name = "transaction.recurrpay";

    var monthly_prefills = window.oc_monthly_prefills
      ? window.oc_monthly_prefills
      : [22, 45, 105, 175, 250];
    var single_prefills = window.oc_single_prefills
      ? window.oc_single_prefills
      : [50, 75, 150, 250, 500];
    var pre_selected_value = window.oc_selected_prefill
      ? parseInt(window.oc_selected_prefill)
      : 0;

    var current_donation_frequency = "";
    var current_donation_amount = window.getDonationAmount();

    function selectDonationValue(index) {
      var donate_inputs = document.querySelectorAll(
        'input[name="' + donate_amount_name + '"]'
      );
      for (var i = 0; i < donate_inputs.length; i++) {
        if (i == index) {
          donate_inputs[i].checked = true;
        } else {
          donate_inputs[i].checked = false;
        }
      }

      var donate_other_input = document.querySelector(
        'input[name="' + donate_amount_other_name + '"]'
      );
      if (donate_other_input) {
        if (index == -1 && select_other_if_amount_not_found) {
          donate_other_input.checked = true;
        } else {
          donate_other_input.parentNode.classList.remove("has-value");
          donate_other_input.value = "";
        }
      }
    }

    function replaceDonationValues(
      source_prefills,
      update_prefills,
      prefill_value = 0
    ) {
      var donate_inputs = document.querySelectorAll(
        'input[name="' + donate_amount_name + '"]'
      );
      for (var i = 0; i < donate_inputs.length; i++) {
        donate_inputs[i].value = update_prefills[i];
        donate_inputs[i].parentNode.querySelector("label").textContent =
          "$" + donate_inputs[i].value;
        donate_inputs[i].setAttribute("data-original", update_prefills[i]);
      }

      if (prefill_value && update_prefills.indexOf(prefill_value) > -1)
        current_donation_amount = prefill_value;

      var select_index = update_prefills.indexOf(
        parseInt(current_donation_amount)
      );
      selectDonationValue(select_index);
      if (select_index == -1 && select_other_if_amount_not_found) {
        var donate_other_input = document.querySelector(
          'input[name="' + donate_amount_other_name + '"]'
        );

        if (donate_other_input) {
          donate_other_input.value = current_donation_amount;
          donate_other_input.parentNode.classList.add("has-value");
        }
      }
    }

    function processDonationValues(prefill_value = 0) {
      var current_donation_frequency = window.getDonationFrequency();
      if (current_donation_frequency == " Monthly") {
        replaceDonationValues(single_prefills, monthly_prefills, prefill_value);
      } else {
        replaceDonationValues(monthly_prefills, single_prefills, prefill_value);
      }
    }

    var donation_frequency_buttons = document.querySelectorAll(
      'input[name="' + payment_frequency_name + '"]'
    );
    for (i = 0; i < donation_frequency_buttons.length; i++) {
      donation_frequency_buttons[i].addEventListener("change", function(e) {
        if (processDonationValues) {
          processDonationValues();
        }
      });
    }

    var donation_amount_buttons = document.querySelectorAll(
      'input[name="' + donate_amount_name + '"]'
    );
    for (i = 0; i < donation_amount_buttons.length; i++) {
      donation_amount_buttons[i].addEventListener("change", function(e) {
        current_donation_amount = window.getDonationAmount();
      });
    }

    var donation_amount_other_input = document.querySelector(
      'input[name="' + donate_amount_other_name + '"]'
    );
    if (donation_amount_other_input) {
      donation_amount_other_input.addEventListener("change", function(e) {
        current_donation_amount = window.getDonationAmount();
      });
    }

    processDonationValues(pre_selected_value);
  });
})();

/************************************
 * VISIBILITY
 * Author: Jason Farrell
 * Author URI: http://useallfive.com/
 * Description: Checks if a DOM element is truly visible.
 * Package URL: https://github.com/UseAllFive/true-visibility
 ***********************************/
Element.prototype.isVisible = function() {
  "use strict";

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

    if (!_elementInDocument(el)) {
      return false;
    }

    //-- Return true for document node
    if (9 === p.nodeType) {
      return true;
    }

    //-- Return false if our element is invisible
    if (
      "0" === _getStyle(el, "opacity") ||
      "none" === _getStyle(el, "display") ||
      "hidden" === _getStyle(el, "visibility")
    ) {
      return false;
    }

    if (
      "undefined" === typeof t ||
      "undefined" === typeof r ||
      "undefined" === typeof b ||
      "undefined" === typeof l ||
      "undefined" === typeof w ||
      "undefined" === typeof h
    ) {
      t = el.offsetTop;
      l = el.offsetLeft;
      b = t + el.offsetHeight;
      r = l + el.offsetWidth;
      w = el.offsetWidth;
      h = el.offsetHeight;
    }
    //-- If we have a parent, let's continue:
    if (p) {
      //-- Check if the parent can hide its children.
      if (
        "hidden" === _getStyle(p, "overflow") ||
        "scroll" === _getStyle(p, "overflow")
      ) {
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
      if (el.offsetParent === p) {
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
    if (window.getComputedStyle) {
      return document.defaultView.getComputedStyle(el, null)[property];
    }
    if (el.currentStyle) {
      return el.currentStyle[property];
    }
  }

  function _elementInDocument(element) {
    while ((element = element.parentNode)) {
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

var donation_amount_name = "transaction.donationAmt";
var donation_amount_other_name = "transaction.donationAmt.other";
var processing_fee_name = "supporter.processing_fees";
var payment_frequency_name = "transaction.recurrpay";
var payment_source_class = ".give-by-select";
var payment_card_type = "transaction.paymenttype";
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
  observer.observe(element, { childList: true });
};

window.clearErrorOnInputHandler = function(element) {
  element.addEventListener("focus", function(e) {
    window.clearError(this);
    document.querySelector(submit_button_selector).disabled = false;
  });
};
window.getDonationInput = function() {
  var donation_amount_buttons = document.querySelectorAll(
    'input[name="' + donation_amount_name + '"]'
  );
  for (i = 0; i < donation_amount_buttons.length; i++) {
    if (donation_amount_buttons[i].checked) {
      if (isNaN(donation_amount_buttons[i].value)) {
        return document.querySelector(
          'input[name="' + donation_amount_other_name + '"]'
        );
      } else {
        return donation_amount_buttons[i];
      }
    }
  }
  return undefined;
};

window.getDonationAmount = function(exclude_fee) {
  exclude_fee = exclude_fee || false;
  var donation_input = window.getDonationInput();
  if (donation_input == undefined) return 0;
  if (exclude_fee) return donation_input.value;
  return donation_input.hasAttribute("data-original")
    ? parseFloat(donation_input.getAttribute("data-original"))
    : parseFloat(donation_input.value);
};

window.getDonationFrequency = function() {
  var donation_frequency_buttons = document.querySelectorAll(
    'input[name="' + payment_frequency_name + '"]'
  );
  for (i = 0; i < donation_frequency_buttons.length; i++) {
    if (donation_frequency_buttons[i].checked) {
      return donation_frequency_buttons[i].value == "Y" ? " Monthly" : "";
    }
  }
  return undefined;
};

window.getItemFromStorage = function(item) {
  if (typeof Storage !== "undefined") {
    return window.sessionStorage.getItem(item);
  } else {
  }
};

window.putItemInStorage = function(item, value) {
  if (typeof Storage !== "undefined") {
    window.sessionStorage.setItem(item, value);
  } else {
  }
};

window.getProcessingFee = function() {
  if (typeof window.calculateProcessingFee === "function") {
    var processing_fee_checkbox = document.querySelector(
      'input[name="' + processing_fee_name + '"]'
    );
    if (processing_fee_checkbox) {
      return window.calculateProcessingFee();
    }
  }
  return 0;
};

window.getDonationInput = function() {
  var donation_amount_buttons = document.querySelectorAll(
    'input[name="' + donation_amount_name + '"]'
  );
  for (i = 0; i < donation_amount_buttons.length; i++) {
    if (donation_amount_buttons[i].checked) {
      if (isNaN(donation_amount_buttons[i].value)) {
        return document.querySelector(
          'input[name="' + donation_amount_other_name + '"]'
        );
      } else {
        return donation_amount_buttons[i];
      }
    }
  }
};

window.getPaymentType = function() {
  var payment_type_buttons = document.querySelectorAll(
    payment_source_class + ' input[type="radio"]'
  );
  for (i = 0; i < payment_type_buttons.length; i++) {
    if (payment_type_buttons[i].checked) {
      if (payment_type_buttons[i].value == "card") {
        return document.querySelector(
          'select[name="' + payment_card_type + '"]'
        ).value;
      } else {
        return payment_type_buttons[i].value;
      }
    }
  }
};

// Helper function to remove an option from a select
window.removeSelectValue = function(field, option_value) {
  var options = field.getElementsByTagName("option");
  for (i = 0; i < options.length; i++) {
    if (options[i].value == option_value) {
      field.remove(i);
      break;
    }
  }
};

// Helper function to add an option to a select & set it as the selected value (optional)
window.addSelectValue = function(field, option_label, option_value, selected) {
  var option = document.createElement("option");
  option.value = option_value;
  option.label = option_label;
  field.appendChild(option);
  if (selected) field.value = option_value;
};

// Helper function to fetch the selected value of a set of radio buttons
window.getSelectedRadioValue = function(radio_buttons_name) {
  var buttons = document.getElementsByName(radio_buttons_name);
  for (var i = 0; i < buttons.length; i++) {
    if (buttons[i].checked) return buttons[i].value;
  }
};

window.dispatchEvent(new Event("oc_en_helpers_loaded"));

/*****************************
 * Donation page scripts
 ****************************/

(function() {
  /**
   * Handle recurring payment date
   */

  function getDonationFrequency() {
    var donation_frequency_buttons = document.querySelectorAll(
      'input[name="transaction.recurrpay"]'
    );
    for (i = 0; i < donation_frequency_buttons.length; i++) {
      if (donation_frequency_buttons[i].checked) {
        return donation_frequency_buttons[i].value == "Y" ? "Monthly" : "";
      }
    }
    return undefined;
  }

  // Add our donation frequency change handler
  var donation_frequency_buttons = document.querySelectorAll(
    'input[name="transaction.recurrpay"]'
  );
  for (i = 0; i < donation_frequency_buttons.length; i++) {
    donation_frequency_buttons[i].addEventListener("change", function() {
      setRecurringDay();
    });
  }

  function setRecurringDay() {
    var frequency = getDonationFrequency();
    var recurring_day_input = document.getElementsByName(
      "transaction.recurrday"
    )[0];
    if (recurring_day_input) {
      if (frequency == "Monthly") {
        var d = new Date();
        var day = d.getDate();
        recurring_day_input.value = day > 28 ? 28 : day;
      } else {
        recurring_day_input.value = "";
      }
    }
  }

  setRecurringDay();
})();

/*
(function() {
    //
     // Handle surprise radio and input field
    //

    //Checks to see if Other Input exists first
    var otherInput = document.getElementsByClassName("en__field__input--other");

    if(otherInput.length)
    {
        // get elements
        var activeTab = otherInput[0].parentElement,
            activePrevSibling = activeTab.previousElementSibling,
            activeNextSibling = activeTab.nextElementSibling;

        activePrevSibling.className += " en__field__item--other-radio";
        var surpriseLabel = activePrevSibling.getElementsByTagName("label")[0];
        var surpriseRadio = activePrevSibling.getElementsByTagName("input")[0];

        var surpriseInput = document.querySelector('[name="transaction.donationAmt.other"]');
        var mainContent = document.getElementById('main-content');

        
        // remove surprise label text and use as placeholder
        if (surpriseLabel && surpriseInput) {
            var surpriseLabelText = surpriseLabel.textContent;
            surpriseLabel.textContent = '';
            surpriseInput.placeholder = surpriseLabelText;
            surpriseInput.setAttribute('aria-label', 'Other donation amount');
        }
        

        // set checked attribute on radio
        // when the other amt input is focused
        if (surpriseRadio) {
            mainContent.addEventListener('focus', function(e) {
                var isOtherDonationAmtInput = e.target.matches('input.en__field__input.en__field__input--other');
                if (isOtherDonationAmtInput) {
                    surpriseRadio.setAttribute('checked', '');
                } else {
                    surpriseRadio.removeAttribute('checked');
                }
            }, true);
        }
    }

})();
*/

/* Should also be made specific to only work with Radio inputs and have it's corresponding code and class names updated for Radio inputs only as well */
(function() {
  // If a hidden input field is clicked, check if it's the hidden input field and set check corresponding radio select
  var enHiddenInputField = document.querySelectorAll(
    ".en__field--withOther .en__field__input--other"
  );
  for (var i = 0; i < enHiddenInputField.length; i++) {
    enHiddenInputField[i].addEventListener("input", function(e) {
      this.parentNode.parentNode.querySelector(
        ".en__field__item:nth-last-child(2) input"
      ).checked = true;
    });
  }
})();

(function() {
  /**
   * Handle credit card security code placeholder
   */

  // get elements
  var paymentTypeEl = document.getElementById(
      "en__field_transaction_paymenttype"
    ),
    securityCodeEl = document.getElementById("en__field_transaction_ccvv");

  // set the placeholder to to 4 digits if AMEX or 3 otherwise
  if (paymentTypeEl) {
    setSecCodePlaceholder(securityCodeEl, this, "AX", "4 digits", "3 digits");
    paymentTypeEl.addEventListener("change", function() {
      setSecCodePlaceholder(securityCodeEl, this, "AX", "4 digits", "3 digits");
    });
  }

  function setSecCodePlaceholder(el1, el2, cardType, string1, string2) {
    el1.placeholder = el2.value === cardType ? string1 : string2;
  }
})();

/*****************************
 * Advocacy page scripts
 ****************************/

(function() {
  /**
   * Display/hide the message area
   */

  // get the element
  var en_actionMessageToggle = document.getElementById(
    "en_actionMessageToggle"
  );

  if (en_actionMessageToggle) {
    // get the grandparent element
    var en_actionMessageDetails =
      en_actionMessageToggle.parentElement.parentElement;

    en_actionMessageDetails.classList.add("msgDetails");
    en_actionMessageDetails.setAttribute("role", "tabpanel");
    en_actionMessageDetails.setAttribute("aria-labelledby", "viewMessage");

    // toggle the active class value to show/hide
    var en_actionMessageToggle_ToggleButton = document.getElementById(
      "en_actionMessageToggle_ToggleButton"
    );
    en_actionMessageToggle_ToggleButton.addEventListener("click", function() {
      var isExpanded = this.getAttribute("aria-expanded") === "true";
      this.classList.toggle("active");
      en_actionMessageDetails.classList.toggle("show");
      this.setAttribute("aria-expanded", !isExpanded);
    });
  }
})();

(function() {
  /**
   * Insert a <label> for each target contact checkbox
   */

  // declare variables and get the parent element
  var en__contactDetails, en__contactDetails__rows;
  var label, checkBox, contactNumber, contactIdVal;
  var en__contact = document.getElementsByClassName("en__contact");
  var contactCount = en__contact.length;

  if (en__contact) {
    for (var i = 0; i < contactCount; i++) {
      // get contact detail elements for each contact
      en__contactDetails = document.getElementsByClassName(
        "en__contactDetails"
      )[i];
      en__contactDetails__rows = document.getElementsByClassName(
        "en__contactDetails__rows"
      )[i];
      contactNumber = en__contact[i].getAttribute("data-contact");

      // create a unique id value for each contact
      contactIdVal = "en__contactId__" + contactNumber + "--" + i;

      // get each checkbox element and give it
      // a unique id value and class values to match
      // other EN checkboxes
      checkBox = document.getElementsByClassName("en__contactDetails__select")[
        i
      ];
      checkBox.setAttribute("id", contactIdVal);
      checkBox.setAttribute(
        "class",
        "en__contactDetails__select en__field__input--checkbox"
      );

      // create a <label> for each contact
      // and set for and class values
      label = document.createElement("label");
      label.setAttribute("for", contactIdVal);
      label.setAttribute("class", "en__field__label");

      // insert the <label> before .en__contactDetails__rows
      en__contactDetails.insertBefore(label, en__contactDetails__rows);
    }
  }
})();

/*****************************
 * Set Input Placeholders
 ****************************/

/*
(function() {
    // set placeholder for address2
    var address2 = document.getElementById('en__field_supporter_address2');
    if (address2) {
        address2.placeholder = 'Apt, ste, bldg.';
    }
})();
*/

/*****************************
 * Submit Btn Loading Spinner
 ****************************/

(function() {
  // get the button element
  var submitBtnEl = document.querySelector(
    "div.en__component.en__component--formblock button"
  );

  // display spinner and disable button
  // if there are no error messages
  if (submitBtnEl) {
    submitBtnEl.addEventListener("click", function(e) {
      // setTimeout to place in queue instead
      // of in call stack immediately.
      // Allows time for validation to occur first.
      setTimeout(function() {
        // check for empty required inputs and neverbounce, if included
        if (
          !isMissingRequiredInputs() &&
          (typeof window.en_nb_valid_email == "undefined" ||
            window.en_nb_valid_email)
        ) {
          submitBtnEl.innerHTML =
            '<div class="loaders"><span class="loader loader-quart"> </span> Processing...</div>';
          submitBtnEl.setAttribute("disabled", "");
        }
      }, 0);
    });
  }

  function isMissingRequiredInputs() {
    return document.querySelector('[class="en__field__error"]');
  }
})();

/************************************
 * On "DOMContentLoaded"
 * The browser fully loaded HTML, and the DOM tree is built, but external resources like pictures <img> and stylesheets may be not yet loaded.
 * REF: https://www.kirupa.com/html5/images/summary_72.png
 * REF: https://www.kirupa.com/html5/running_your_code_at_the_right_time.htm
 ***********************************/

function domHasLoaded(e) {
  // 4Site Studios helper script for automatically submitting a form on Engaging Networks. Works when "en-auto-submit=1" is present in URL
  // Alternate code using mutation observer to potentially fire sooner: https://pastebin.com/raw/kReLvTL6
  var id = getUrlParam("en-auto-submit");
  if (id > "") {
    document.querySelector(".en__submit button").click();
  }
}

/************************************
 * On "Load"
 * Same as "DOMContentLoaded" but the browser has also loaded all resources (images, styles etc).
 * REF: https://www.kirupa.com/html5/images/summary_72.png
 * REF: https://www.kirupa.com/html5/running_your_code_at_the_right_time.htm
 ***********************************/

function pageHasLoaded(e) {
  // Utilizing PYM responsive iFrame library, resizes parent iFrame any time a child iframe is clicked. This is overkill but a quick fix that solves for most use cases.
  if (typeof pymChild !== "undefined") {
    document.onclick = function() {
      // Send height update immedietely.
      pymChild.sendHeight();

      // And then wait a moment before triggering again so any visual page redraw is corrected for.
      setTimeout(function() {
        pymChild.sendHeight();
      }, 25);
    };
  }

  // The Auto Submit argument is present in the local storage, click the submit button.
  if (typeof Storage !== "undefined") {
    if (localStorage.quickSubmit == "true") {
      // The Auto Submit argument is present in the local storage
      var submitBtn = document.querySelector(
        "#en_actionMessageToggle_SubmitButton button"
      );
      if (submitBtn) submitBtn.click();
    }
  }
}

/************************************
 * BACKGROUND SETTINGS
 ***********************************/
(function() {
  window.addEventListener("load", function() {
    var html = document.getElementsByTagName("html")[0]; // '0' to assign the first (and only `HTML` tag)
    var body = document.getElementsByTagName("body")[0]; // '0' to assign the first (and only `HTML` tag)

    var layoutSettings = document.querySelector(".layout-settings");
    var backgroundSettings = document.querySelector(".background-settings");

    if (layoutSettings) {
      if (layoutSettings.classList.contains("form-right")) {
        body.classList.add("form-right");
      } else if (layoutSettings.classList.contains("form-left")) {
        body.classList.add("form-left");
      } else {
        body.classList.add("form-center");
      }

      if (layoutSettings.classList.contains("form-side-by-side")) {
        body.classList.add("form-side-by-side");
      }

      if (layoutSettings.classList.contains("form-one-column")) {
        body.classList.remove("side-by-side");
        body.classList.remove("form-side-by-side");
      }
    }

    if (backgroundSettings) {
      if (backgroundSettings.classList.contains("background-settings")) {
        html.classList.add("background-settings-applied");
      }

      var backgroundImageURL = document.querySelector(".background-settings p");

      if (backgroundImageURL) {
        backgroundImageURL = backgroundImageURL.innerHTML;

        html.classList.add("has-image");
        body.style.backgroundImage = 'url("' + backgroundImageURL + '")';
      }
    }
  });
})();

/************************************
 * CLICK TO EXPAND
 ***********************************/
(function() {
  window.addEventListener("load", function() {
    // This function works when the user has added ".clicl-to-expand" as a class in page builder to a field. Not meant to have multiples of these on a single page

    window.expandDiv = function() {
      clickToExpandWrapper.classList.add("expanded");
    };

    // Add the click to expand CTA
    var clickToExpandWrapper = document.querySelector(".click-to-expand");

    if (clickToExpandWrapper) {
      var existing_html = clickToExpandWrapper.innerHTML;
      var wrapper_html =
        '<div class="click-to-expand-cta" onclick="window.expandDiv()"></div><div class="click-to-expand-text-wrapper" onclick="window.expandDiv()">' +
        existing_html +
        "</div>";
      clickToExpandWrapper.innerHTML = wrapper_html;
      clickToExpandWrapper.style.opacity = "1";
    }
  });
})();

/************************************
 * INTERNATIONALIZATION
 ***********************************/
(function() {
  window.addEventListener("load", function() {
    // This function works when the user has added ".simple_country_select" as a class in page builder for the Country select

    // Helper function to insert HTML after a node
    function insertAfter(el, referenceNode) {
      referenceNode.parentNode.insertBefore(el, referenceNode.nextSibling);
    }

    // Helper function to wrap a target in a new element
    function wrap(el, wrapper) {
      el.parentNode.insertBefore(wrapper, el);
      wrapper.appendChild(el);
    }

    // Show the Country select dropdown and hide international label. Called when inserted label is clicked.
    window.showCountrySelect = function() {
      countryWrapper.classList.add("country-select-visible");
      addressWrapper.classList.add("country-select-visible");
      countrySelect.focus();

      var countrySelectLabel = document.querySelector(
        "#en_custom_simple_country_select"
      );

      // Reinstate Country Select tab index
      countrySelect.removeAttribute("tabIndex");
    };

    var countrySelect = document.querySelector("#en__field_supporter_country");

    if (countrySelect) {
      var countrySelecLabel =
        countrySelect.options[countrySelect.selectedIndex].innerHTML;
      var countrySelecValue =
        countrySelect.options[countrySelect.selectedIndex].value;
    }

    if (countrySelecValue == "US") {
      countrySelecValue = " US";
    }

    if (countrySelecLabel == "United States") {
      countrySelecLabel = "the US";
    }

    var countryWrapper = document.querySelector(".simple_country_select");

    if (countryWrapper) {
      // Remove Country Select tab index
      countrySelect.tabIndex = "-1";

      // Find the address label
      var addressWrapper = document.querySelector(".en__field--address1 label")
        .parentElement.parentElement;
      var addressLabel = document.querySelector(".en__field--address1 label");

      // EN does not enforce a labels on fields so we have to check for it
      if (addressLabel) {
        // Wrap the address label in a div to break out of the flexbox
        wrap(addressLabel, document.createElement("div"));

        // Add our link after the address label
        // Includes both long form and short form variants
        var newEl = document.createElement("span");
        newEl.innerHTML =
          ' <label id="en_custom_field_simple_country_select_long" class="en__field__label"><a onclick="window.showCountrySelect()">(Outside ' +
          countrySelecLabel +
          '?)</a></label><label id="en_custom_field_simple_country_select_short" class="en__field__label"><a onclick="window.showCountrySelect()">(Outside ' +
          countrySelecValue +
          "?)</a></label>";
        insertAfter(newEl, addressLabel);
      }
    }
  });
})();

/************************************
 * FIELD OVERRIDES
 ***********************************/
window.addEventListener("load", function() {
  // On multipage forms, the country is not available on the first page, but some of the other fields are
  // This does not set the country field automatically--it merely provides a country value for the field overrides if the country select isn't present
  var default_country = "US";

  var default_field_overrides = [
    { name: "transaction.recurrday", autocomplete: "none" },
    { name: "transaction.recurrfreq", autocomplete: "none" },
    {
      id: "en__field_supporter_firstName",
      placeholder: "First name",
      autocomplete: "given-name"
    },
    {
      id: "en__field_supporter_lastName",
      placeholder: "Last name",
      autocomplete: "family-name"
    },
    {
      id: "en__field_supporter_emailAddress",
      placeholder: "Email address",
      type: "email",
      autocomplete: "email"
    },
    { id: "en__field_supporter_country", autocomplete: "country-name" },
    {
      id: "en__field_supporter_address1",
      placeholder: "Street address",
      autocomplete: "section-billing address-line1"
    },
    {
      id: "en__field_supporter_address2",
      placeholder: "Apt., ste., bldg.",
      autocomplete: "section-billing address-line2"
    },
    {
      id: "en__field_supporter_region",
      autocomplete: "section-billing address-level1"
    },
    {
      id: "en__field_supporter_city",
      autocomplete: "section-billing address-level2"
    },
    {
      id: "en__field_supporter_postcode",
      autocomplete: "section-billing postal-code"
    },
    { id: "en__field_supporter_phoneNumber", autocomplete: "tel" },
    {
      id: "en__field_transaction_ccnumber",
      placeholder: "Card number",
      autocomplete: "cc-number",
      type: "tel"
    },
    { id: "en__field_transaction_paymenttype", autocomplete: "cc-type" },
    { id: "en__field_transaction_ccvv", type: "tel", autocomplete: "cc-csc" },
    { name: "transaction.donationAmt.other", placeholder: "Other", type: "tel" }
  ];

  var us_field_overrides = [
    {
      id: "en__field_supporter_phoneNumber",
      placeholder: "000-000-0000",
      placeholderOptional: "000-000-0000 (optional)",
      type: "tel"
    },
    {
      id: "en__field_supporter_postcode",
      placeholder: "ZIP Code",
      label: "ZIP Code",
      type: "tel"
    },
    { id: "en__field_supporter_city", placeholder: "City", label: "City" },
    {
      id: "en__field_supporter_region",
      label: "State",
      label: "State",
      type: "select",
      options: [
        { value: "", label: "Select a State" },
        { value: "AL", label: "Alabama" },
        { value: "AK", label: "Alaska" },
        { value: "AZ", label: "Arizona" },
        { value: "AR", label: "Arkansas" },
        { value: "CA", label: "California" },
        { value: "CO", label: "Colorado" },
        { value: "CT", label: "Connecticut" },
        { value: "DE", label: "Delaware" },
        { value: "DC", label: "District of Columbia" },
        { value: "FL", label: "Florida" },
        { value: "GA", label: "Georgia" },
        { value: "HI", label: "Hawaii" },
        { value: "ID", label: "Idaho" },
        { value: "IL", label: "Illinois" },
        { value: "IN", label: "Indiana" },
        { value: "IA", label: "Iowa" },
        { value: "KS", label: "Kansas" },
        { value: "KY", label: "Kentucky" },
        { value: "LA", label: "Louisiana" },
        { value: "ME", label: "Maine" },
        { value: "MD", label: "Maryland" },
        { value: "MA", label: "Massachusetts" },
        { value: "MI", label: "Michigan" },
        { value: "MN", label: "Minnesota" },
        { value: "MS", label: "Mississippi" },
        { value: "MO", label: "Missouri" },
        { value: "MT", label: "Montana" },
        { value: "NE", label: "Nebraska" },
        { value: "NV", label: "Nevada" },
        { value: "NH", label: "New Hampshire" },
        { value: "NJ", label: "New Jersey" },
        { value: "NM", label: "New Mexico" },
        { value: "NY", label: "New York" },
        { value: "NC", label: "North Carolina" },
        { value: "ND", label: "North Dakota" },
        { value: "OH", label: "Ohio" },
        { value: "OK", label: "Oklahoma" },
        { value: "OR", label: "Oregon" },
        { value: "PA", label: "Pennsylvania" },
        { value: "RI", label: "Rhode Island" },
        { value: "SC", label: "South Carolina" },
        { value: "SD", label: "South Dakota" },
        { value: "TN", label: "Tennessee" },
        { value: "TX", label: "Texas" },
        { value: "UT", label: "Utah" },
        { value: "VT", label: "Vermont" },
        { value: "VA", label: "Virginia" },
        { value: "WA", label: "Washington" },
        { value: "WV", label: "West Virginia" },
        { value: "WI", label: "Wisconsin" },
        { value: "WY", label: "Wyoming" }
      ]
    }
  ];

  var canada_field_overrides = [
    {
      id: "en__field_supporter_phoneNumber",
      placeholder: "000-000-0000",
      placeholderOptional: "000-000-0000 (optional)",
      type: "tel"
    },
    {
      id: "en__field_supporter_postcode",
      placeholder: "ZIP Code",
      label: "ZIP Code",
      type: "text"
    },
    {
      id: "en__field_supporter_city",
      placeholder: "Municipality",
      label: "Municipality"
    },
    {
      id: "en__field_supporter_region",
      label: "Province",
      type: "select",
      options: [
        { value: "", label: "Select a Province" },
        { value: "AB", label: "Alberta" },
        { value: "BC", label: "British Columbia" },
        { value: "MB", label: "Manitoba" },
        { value: "NB", label: "New Brunswick" },
        { value: "NL", label: "Newfoundland and Labrador" },
        { value: "NT", label: "Northwest Territories" },
        { value: "NS", label: "Nova Scotia" },
        { value: "NU", label: "Nunavut" },
        { value: "ON", label: "Ontario" },
        { value: "PE", label: "Prince Edward Island" },
        { value: "QC", label: "Quebec" },
        { value: "SK", label: "Saskatchewan" },
        { value: "YT", label: "Yukon" }
      ]
    }
  ];

  var other_field_overrides = [
    {
      id: "en__field_supporter_city",
      placeholder: "City / Town",
      label: "City / Town"
    },
    {
      id: "en__field_supporter_postcode",
      placeholder: "Postal code",
      label: "Postal code",
      type: "text"
    },
    {
      id: "en__field_supporter_region",
      placeholder: "Province / State / County",
      label: "Province / State / County",
      type: "text"
    },
    {
      id: "en__field_supporter_phoneNumber",
      placeholder: "Required",
      placeholderOptional: "Optional",
      type: "tel"
    }
  ];

  function changeInputType(old_obj, obj_type) {
    var new_obj = null;

    if (obj_type == "select") {
      new_obj = document.createElement("select");
    } else {
      new_obj = document.createElement("input");
      new_obj.type = obj_type;
    }

    if (old_obj.name) new_obj.name = old_obj.name;
    if (old_obj.id) new_obj.id = old_obj.id;
    if (old_obj.className) new_obj.className = old_obj.className;

    old_obj.parentNode.replaceChild(new_obj, old_obj);

    return new_obj;
  }

  function removeChildNodes(field) {
    while (field.firstChild) {
      field.removeChild(field.firstChild);
    }
  }

  function setFieldsFromArray(field_overrides) {
    for (i = 0; i < field_overrides.length; i++) {
      var field = null;
      if (field_overrides[i].id) {
        field = document.getElementById(field_overrides[i].id);
      } else if (field_overrides[i].name) {
        // this is probably an input
        field = document.querySelector(
          'input[name="' + field_overrides[i].name + '"]'
        );
        // but if not, lets try for a select with that name
        if (!field)
          field = document.querySelector(
            'select[name="' + field_overrides[i].name + '"]'
          );
        // last chance...perhaps a textarea?
        if (!field)
          field = document.querySelector(
            'textarea[name="' + field_overrides[i].name + '"]'
          );
      }
      // no field to work with
      if (!field) continue;

      if (field_overrides[i].type) {
        var current_element_type = field.tagName.toLowerCase();
        if (
          (field_overrides[i].type == "select" ||
            current_element_type == "select") &&
          current_element_type != field_overrides[i].type
        ) {
          changeInputType(field, field_overrides[i].type);
          field = document.getElementById(field_overrides[i].id);
        } else {
          field.type = field_overrides[i].type;
        }
      }

      if (field_overrides[i].options) {
        removeChildNodes(field);
        for (j = 0; j < field_overrides[i].options.length; j++) {
          var option = document.createElement("option");
          option.value = field_overrides[i].options[j].value;
          option.text = field_overrides[i].options[j].label;
          field.appendChild(option);
        }
      }

      if (field_overrides[i].placeholder) {
        field.placeholder = field_overrides[i].placeholder;
        if (field_overrides[i].placeholderOptional) {
          if (
            !field.required &&
            !field.parentElement.parentElement.classList.contains(
              "en__mandatory"
            )
          ) {
            field.placeholder = field_overrides[i].placeholderOptional;
          }
        }
      }

      if (field_overrides[i].label) {
        var label = field.parentElement.parentElement.getElementsByTagName(
          "label"
        )[0];
        label.innerHTML = field_overrides[i].label;
      }

      if (field_overrides[i].pattern) {
        field.setAttribute("pattern", field_overrides[i].pattern);
      }

      if (field_overrides[i].autocomplete) {
        field.setAttribute("autocomplete", field_overrides[i].autocomplete);
      }
    }
  }

  function overrideFields(country) {
    setFieldsFromArray(default_field_overrides);

    switch (country) {
      case "US":
      case "USA":
        setFieldsFromArray(us_field_overrides);
        break;
      case "CA":
      case "CAN":
        setFieldsFromArray(canada_field_overrides);
        break;
      default:
        setFieldsFromArray(other_field_overrides);
        break;
    }
  }

  var country = document.getElementById("en__field_supporter_country");
  if (country) {
    country.onchange = function() {
      overrideFields(this.value);
    };
    overrideFields(country.value);
  } else {
    overrideFields(default_country);
  }
});

/************************************
 * PAYMENT METHOD HANDLERS
 ***********************************/
(function() {
  window.addEventListener("load", function() {
    // Input names and IDs we reference
    var payment_method_wrapper_class_name = "en__field--giveBySelect";
    var payment_by_card_block_class_name = "give-by-card";
    var payment_by_paypal_block_class_name = "give-by-paypal";
    var payment_by_check_block_class_name = "give-by-check";
    var payment_type_select_id = "en__field_transaction_paymenttype";
    var bank_account_type_name = "supporter.bankAccountType";

    var cc_exp_name = "transaction.ccexpire";
    var cc_cvv_name = "transaction.ccvv";
    var cc_number_name = "transaction.ccnumber";

    var check_bank_account_type_name = "supporter.bankAccountType";
    var check_bank_account_number_name = "supporter.bankAccountNumber";
    var check_routing_number_name = "supporter.bankRoutingNumber";

    var donation_amount_name = "transaction.donationAmt";
    var donation_amount_other_name = "transaction.donationAmt.other";

    var submit_button_selector = ".en__submit button";
    /*
      var cc_cvv_id = 'en__field_transaction_ccvv';
      var cc_number_id = 'en__field_transaction_ccnumber';
      var check_bank_account_type_id = 'en__field_supporter_bankAccountType';
      var check_bank_number_id = 'en__field_supporter_bankAccountNumber';
      var check_routing_number_id = 'en__field_supporter_bankRoutingNumber';
      */

    // Update the payment type select depending on the payment method
    function setPaymentTypeSelect(payment_method) {
      var bank_account_type_element = document.getElementsByName(
        bank_account_type_name
      );

      if (payment_type_select_id) {
        var payment_type_select = document.getElementById(
          payment_type_select_id
        );
      }

      if (bank_account_type_element.length) {
        var bank_account_type = document.getElementsByName(
          bank_account_type_name
        )[0];
      }

      switch (payment_method) {
        case "paypal":
          if (payment_type_select) {
            window.addSelectValue(
              payment_type_select,
              "PayPal",
              "Paypal",
              true
            );
            window.removeSelectValue(payment_type_select, "ACH");
          }

          if (typeof bank_account_type == "object") {
            bank_account_type.value = "";
          }
          break;
        case "card":
          if (payment_type_select) {
            window.removeSelectValue(payment_type_select, "Paypal");
            window.removeSelectValue(payment_type_select, "ACH");
          }

          if (typeof bank_account_type == "object") {
            bank_account_type.value = "";
          }
          break;
        case "check":
          if (payment_type_select) {
            window.addSelectValue(payment_type_select, "Check", "ACH", true);
            window.removeSelectValue(payment_type_select, "Paypal");
          }

          if (typeof bank_account_type == "object") {
            bank_account_type.value = "Checking";
          }
          break;
      }
      //document.querySelector("body.template-right").classList.add("loaded");
    }

    // Show or hide all blocks with a class name
    function setBlockVisibility(class_name, show) {
      var blocks = document.getElementsByClassName(class_name);
      for (var i = 0; i < blocks.length; i++) {
        if (show) {
          blocks[i].style.display = "";
        } else {
          blocks[i].style.display = "none";
          window.clearAllErrors(blocks[i]);
        }
      }
    }

    // Show the correct payment block
    function handlePaymentMethod(payment_method) {
      setPaymentTypeSelect(payment_method);

      switch (payment_method) {
        case "paypal":
          setBlockVisibility(payment_by_paypal_block_class_name, true);
          setBlockVisibility(payment_by_card_block_class_name, false);
          setBlockVisibility(payment_by_check_block_class_name, false);
          break;
        case "card":
          setBlockVisibility(payment_by_card_block_class_name, true);
          setBlockVisibility(payment_by_paypal_block_class_name, false);
          setBlockVisibility(payment_by_check_block_class_name, false);
          break;
        case "check":
          setBlockVisibility(payment_by_check_block_class_name, true);
          setBlockVisibility(payment_by_card_block_class_name, false);
          setBlockVisibility(payment_by_paypal_block_class_name, false);
          break;
      }
    }

    // Validate each of the displayed payment fields
    function validatePaymentFields(payment_method) {
      var valid_form = true;

      switch (payment_method) {
        case "card":
          var cc_exp = document.querySelectorAll(
            'select[name="' + cc_exp_name + '"]'
          );
          for (i = 0; i < cc_exp.length; i++) {
            if (!cc_exp[i].value) {
              window.setError(cc_exp[i], "CC expiration date must be provided");
              valid_form = false;
              break;
            }
          }
          if (valid_form) clearError(cc_exp[0]);

          valid_form = window.validateFieldByName(cc_cvv_name) && valid_form;
          valid_form = window.validateFieldByName(cc_number_name) && valid_form;
          break;
        case "paypal":
          break;
        case "check":
          valid_form =
            window.validateFieldByName(check_bank_account_type_name) &&
            valid_form;
          valid_form =
            window.validateFieldByName(check_bank_account_number_name) &&
            valid_form;
          valid_form =
            window.validateFieldByName(check_routing_number_name) && valid_form;
          break;
      }

      return valid_form;
    }

    // Add our payment button change handler
    var payment_button_wrapper = document.getElementsByClassName(
      payment_method_wrapper_class_name
    );
    if (payment_button_wrapper.length) {
      var payment_method_buttons = payment_button_wrapper[0].getElementsByTagName(
        "input"
      );
      for (i = 0; i < payment_method_buttons.length; i++) {
        payment_method_buttons[i].addEventListener("change", function() {
          handlePaymentMethod(this.value);
        });
      }
    }

    // Add our donation amount change handler
    var donation_amount_buttons = document.querySelectorAll(
      'input[name="' + donation_amount_name + '"]'
    );
    for (i = 0; i < donation_amount_buttons.length; i++) {
      donation_amount_buttons[i].onchange = function() {
        if (parseInt(window.getSelectedRadioValue(donation_amount_name))) {
          document
            .querySelector('input[name="' + donation_amount_other_name + '"]')
            .parentNode.classList.remove("has-value");
        }
      };
    }

    // Add our form submit handler
    var form = document.querySelector("form.en__component");
    if (form) {
      form.addEventListener("submit", function(e) {
        // add a class to the body to assist with EN's automatic scroll-to-first-error functionality
        // when we have moved the error display to below the field instead of the default top location
        document.querySelector("body").classList.add("error-jump-assist");
        var valid_form = validatePaymentFields(
          window.getSelectedRadioValue(
            document
              .querySelectorAll(
                "." + payment_method_wrapper_class_name + ' input[type="radio"]'
              )[0]
              .getAttribute("name")
          )
        ); // && (typeof window.en_nb_valid_email === 'undefined' || window.en_nb_valid_email);

        if (window.getDonationAmount() <= 0) {
          var donation_fields = document.querySelector(
            'input[name="transaction.donationAmt"]'
          );
          window.setError(donation_fields, "Please select an amount.");
          donation_fields.scrollIntoView(true);
          valid_form = false;
        }

        if (!valid_form) {
          e.preventDefault();
          e.stopImmediatePropagation();
          this.querySelector(submit_button_selector).disabled = false;
          return false;
        }
      });
    }

    // Initialize the current payment method
    handlePaymentMethod(
      window.getSelectedRadioValue(
        document
          .querySelectorAll(
            "." + payment_method_wrapper_class_name + ' input[type="radio"]'
          )[0]
          .getAttribute("name")
      )
    );

    // Initialize error wrapper handling for the errors produced by Engaging Networks
    if (form) {
      var form_inputs = form.getElementsByTagName("input");
    }

    if (form_inputs) {
      for (var i = 0; i < form_inputs.length; i++) {
        if (form_inputs[i].type == "email")
          window.attachAutomatedErrorWrappers(
            window.getFieldWrapper(form_inputs[i]).parentNode
          );
        else
          window.attachAutomatedErrorWrappers(
            window.getFieldWrapper(form_inputs[i])
          );
        window.clearErrorOnInputHandler(form_inputs[i]);
      }
      var form_selects = form.getElementsByTagName("select");
      for (var i = 0; i < form_selects.length; i++) {
        window.attachAutomatedErrorWrappers(
          window.getFieldWrapper(form_selects[i])
        );
        window.clearErrorOnInputHandler(form_selects[i]);
      }
      var form_textareas = form.getElementsByTagName("textarea");
      for (var i = 0; i < form_textareas.length; i++) {
        window.attachAutomatedErrorWrappers(
          window.getFieldWrapper(form_textareas[i])
        );
        window.clearErrorOnInputHandler(form_textareas[i]);
      }
    }

    // Class-toggling for the input[name="transaction.donationAmt.other"] field
    var field_donation_amount_other = document.querySelector(
      'input[name="' + donation_amount_other_name + '"]'
    );
    if (field_donation_amount_other) {
      var change_handler = function(e) {
        if (parseInt(this.value)) this.parentNode.classList.add("has-value");
        else this.parentNode.classList.remove("has-value");
      };

      field_donation_amount_other.addEventListener("input", change_handler);
      field_donation_amount_other.addEventListener("cut", change_handler);
      field_donation_amount_other.addEventListener("paste", change_handler);
      field_donation_amount_other.addEventListener("keydown", change_handler);
    }
  });
})();

/************************************
 * PROCESSING FEE
 ***********************************/
(function() {
  window.addEventListener("load", function() {
    var donation_amount_name = "transaction.donationAmt";
    var donation_amount_other_name = "transaction.donationAmt.other";
    var payment_card_type_name = "transaction.paymenttype";
    var processing_fee_name = "supporter.processing_fees";
    var payment_method_wrapper_class_name = "en__field--give-by-select";

    window.calculateProcessingFee = function() {
      var processing_fee_checkbox = document.querySelector(
        'input[name="' + processing_fee_name + '"]'
      );
      if (
        processing_fee_checkbox &&
        processing_fee_checkbox.checked &&
        processing_fee_checkbox.isVisible()
      ) {
        var payment_type = window.getPaymentType();
        var donation_amount = window.getDonationAmount(true);
        if (donation_amount == 0) return 0;
        var processing_fee = 0;

        switch (payment_type.toUpperCase()) {
          case "VI":
            processing_fee = donation_amount * 0.025 + 0.1;
            break;
          case "MC":
            processing_fee = donation_amount * 0.025 + 0.1;
            break;
          case "DI":
            processing_fee = donation_amount * 0.025 + 0.1;
            break;
          case "AX":
            processing_fee = donation_amount * 0.025 + 0.1;
            break;
          case "PAYPAL":
            processing_fee = donation_amount * 0.05 + 0.3;
            break;
          case "CHECK":
            processing_fee = donation_amount * 0.025 + 0.1;
            break;
          default:
            processing_fee =
              (processing_fee_checkbox.value / 100) * donation_amount;
            break;
        }
        return parseFloat(processing_fee).toFixed(2);
      } else {
        return 0;
      }
    };

    function roundDollarAmount(amount) {
      return +(Math.round(amount + "e+2") + "e-2");
    }

    function setProcessingFee(processing_fee) {
      var donation_input = window.getDonationInput();

      if (!donation_input || !donation_input.value) return;

      var donation_with_fee = roundDollarAmount(
        parseFloat(donation_input.value) + parseFloat(processing_fee)
      );

      donation_input.setAttribute("data-original", donation_with_fee);
      donation_input.setAttribute("data-fee", processing_fee);
    }

    function updateDonationAmount() {
      setProcessingFee(window.calculateProcessingFee());
      window.dispatchEvent(new Event("proccessingFeeCalculated"));
    }

    var form = document.querySelector("form.en__component");
    if (form) {
      form.addEventListener("submit", function(e) {
        updateDonationAmount();
      });
    }

    function initializeBaseDonationAmounts() {
      var donation_amount_buttons = document.querySelectorAll(
        'input[name="' + donation_amount_name + '"]'
      );
      for (i = 0; i < donation_amount_buttons.length; i++) {
        if (!isNaN(donation_amount_buttons[i].value)) {
          donation_amount_buttons[i].setAttribute(
            "data-original",
            donation_amount_buttons[i].value
          );
        }
        donation_amount_buttons[i].addEventListener("click", function(e) {
          updateDonationAmount();
        });
      }
    }
    initializeBaseDonationAmounts();

    // payment type (VI, MC, AM, DI, etc) change handler
    var payment_type_select = document.querySelector(
      'select[name="' + payment_card_type_name + '"]'
    );
    if (payment_type_select) {
      payment_type_select.addEventListener("change", function() {
        updateDonationAmount();
      });
    }

    // payment method (card, paypal, check, etc) click handler
    var payment_button_wrapper = document.getElementsByClassName(
      payment_method_wrapper_class_name
    );
    if (payment_button_wrapper.length) {
      var payment_method_buttons = payment_button_wrapper[0].getElementsByTagName(
        "input"
      );
      for (i = 0; i < payment_method_buttons.length; i++) {
        payment_method_buttons[i].addEventListener("click", function() {
          updateDonationAmount();
        });
        payment_method_buttons[i].addEventListener("change", function() {
          updateDonationAmount();
        });
      }
    }

    // processing fee checkbox change handler
    var processing_fee_checkbox = document.querySelector(
      'input[name="' + processing_fee_name + '"]'
    );
    if (processing_fee_checkbox) {
      processing_fee_checkbox.addEventListener("click", function() {
        updateDonationAmount();
      });
    }

    var field_donation_amount_other = document.querySelector(
      'input[name="' + donation_amount_other_name + '"]'
    );
    if (field_donation_amount_other) {
      field_donation_amount_other.addEventListener(
        "input",
        updateDonationAmount
      );
      field_donation_amount_other.addEventListener("cut", updateDonationAmount);
      field_donation_amount_other.addEventListener(
        "paste",
        updateDonationAmount
      );
      field_donation_amount_other.addEventListener(
        "blur",
        updateDonationAmount
      );
    }
  });
})();

/************************************
 * BUTTON LABEL
 ***********************************/
(function() {
  window.addEventListener("load", function() {
    var donation_amount_name = "transaction.donationAmt";
    var donation_amount_other_name = "transaction.donationAmt.other";
    var processing_fee_present =
      typeof window.calculateProcessingFee === "function";
    var processing_fee_name = "supporter.processing_fees";
    var payment_frequency_name = "transaction.recurrpay";

    function updateLabel() {
      var button = document.querySelector(
        ".smart-gift-amount-submit-label button"
      );
      if (button) {
        button.innerHTML = getLabel();
      }
    }

    function updateAmountLabels() {
      var frequency = window.getItemFromStorage("oc_en_frequency");
      var label_wrappers = document.querySelectorAll(".en__field--donationAmt");
      if (typeof frequency === "string" && frequency.trim() == "Monthly") {
        [].forEach.call(label_wrappers, function(label_wrapper) {
          label_wrapper.classList.add("monthly-giving");
        });
      } else {
        [].forEach.call(label_wrappers, function(label_wrapper) {
          label_wrapper.classList.remove("monthly-giving");
        });
      }
    }

    function updateStorage() {
      var amount = window.getDonationAmount(true);
      if (amount !== undefined) window.putItemInStorage("oc_en_amount", amount);

      var fee = window.getProcessingFee();
      if (fee !== undefined) window.putItemInStorage("oc_en_fee", fee);

      var frequency = window.getDonationFrequency();
      if (frequency !== undefined)
        window.putItemInStorage("oc_en_frequency", frequency);
    }

    function getLabel() {
      var amount = parseFloat(window.getItemFromStorage("oc_en_amount"));
      var fee = parseFloat(window.getItemFromStorage("oc_en_fee"));
      if (isNaN(fee)) fee = 0;
      var frequency = window.getItemFromStorage("oc_en_frequency");
      var total_amount = parseFloat(amount) + parseFloat(fee);
      var total_amount_string = total_amount.toFixed(2).replace(".00", "");
      var label =
        total_amount > 0
          ? "Donate $" + total_amount_string + frequency
          : "Donate Now";
      return label;
    }

    // Add our donation frequency change handler
    var donation_frequency_buttons = document.querySelectorAll(
      'input[name="' + payment_frequency_name + '"]'
    );
    for (i = 0; i < donation_frequency_buttons.length; i++) {
      donation_frequency_buttons[i].addEventListener("change", function() {
        updateStorage();
        updateLabel();
        updateAmountLabels();
      });
    }

    // Add our donation amount change handler
    var donation_amount_buttons = document.querySelectorAll(
      'input[name="' + donation_amount_name + '"]'
    );
    for (i = 0; i < donation_amount_buttons.length; i++) {
      donation_amount_buttons[i].addEventListener("change", function() {
        updateStorage();
        updateLabel();
      });
    }

    // Add our donation "other" change handler
    var donation_amount_other_input = document.querySelector(
      'input[name="' + donation_amount_other_name + '"]'
    );
    if (donation_amount_other_input) {
      var donation_amount_other_change_handler = function(e) {
        updateStorage();
        updateLabel();
      };
      donation_amount_other_input.addEventListener(
        "input",
        donation_amount_other_change_handler
      );
      donation_amount_other_input.addEventListener(
        "cut",
        donation_amount_other_change_handler
      );
      donation_amount_other_input.addEventListener(
        "paste",
        donation_amount_other_change_handler
      );
      donation_amount_other_input.addEventListener(
        "keydown",
        donation_amount_other_change_handler
      );
    }

    // Add our donation fee charge change handler
    window.addEventListener("proccessingFeeCalculated", function() {
      updateStorage();
      updateLabel();
    });

    updateStorage();
    updateLabel();
    updateAmountLabels();
  });
})();

/************************************
 * TOGGLE MEMORY
 ***********************************/
(function() {
  window.addEventListener("load", function() {
    var in_memory_toggle = document.querySelector(
      'input[name="transaction.inmem"]'
    );
    var in_memory_fields = document.querySelectorAll(".give-in-memory");

    if (in_memory_toggle) {
      in_memory_toggle.addEventListener("change", function(e) {
        setFieldsVisibility(in_memory_fields, in_memory_toggle.checked);
      });
    }

    function setFieldsVisibility(fields, show) {
      for (var i = 0; i < fields.length; i++) {
        fields[i].style.display = show ? "" : "none";
      }
    }

    if (in_memory_fields && in_memory_toggle) {
      setFieldsVisibility(in_memory_fields, in_memory_toggle.checked);
    }
  });
})();

/**********************************************************
 *  De-select opt-in if country is changed to outside the US..
 ***********************************************************/
(function() {
  var country = document.getElementById("en__field_supporter_country");
  if (country) {
    country.addEventListener("change", function(e) {
      if (e.target.value != "US") {
        var checkboxes = document.querySelectorAll(
          ".en__field--opt-in .en__field__input--checkbox"
        );
        for (var i = 0; i < checkboxes.length; i++) {
          checkboxes[i].checked = false;
        }
      }
    });
  }
})();

/************************************
 * EN HELPER SCRIPTS
 ***********************************/

  var donation_amount_name = 'transaction.donationAmt';
  var donation_amount_other_name = 'transaction.donationAmt.other';
  var processing_fee_name = 'supporter.questions.64038';
  var payment_frequency_name = 'transaction.recurrpay';
  var payment_source_class = '.give-by-select';
  var payment_card_type = 'transaction.paymenttype';
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
(function($) {
  $.fn.upsell = function(options) {
    // Default Options
    var settings = $.extend(
      {
        title: "Make a Difference Every Month",
        image:
          "https://acb0a5d73b67fccd4bbe-c2d8138f0ea10a18dd4c43ec3aa4240a.ssl.cf5.rackcdn.com/10040/mfa-2018-bg-cows-reversed-1920x1110.jpg",
        bodyText: "Animals suffering at factory farms are counting on you.",
        bodyHeading: "Will you make a monthly donation instead?",
        inputPrefix: "$",
        inputSuffix: "Your recommended <br> monthly gift.",
        buttonLabel: "YES! I'll make a monthly gift",
        denyLabel:
          "<strong>No thanks</strong>, I'll just make my one-time gift",
        bodyTextColor: "#333333",
        bodyBackgroundColor: "#FFFFFF",
        formTextColor: "#FFFFFF",
        formBackgroundColor: "#0666f2",
        buttomTextColor: "#FFFFFF",
        buttomBackgroundColor: "#f99338",
        maxLimit: 200,
        minLimit: 10
      },
      options
    );

    // Check if this is a valid form
    if (isEN(this)) {
      var $form = this;
      var amount = $(
        'input[name="transaction.donationAmt"]:checked',
        $form
      ).val();
      if (amount == "other") {
        amount = $('input[name="transaction.donationAmt.other"]', $form).val();
      }
      var recurrpay = $(
        'input[name="transaction.recurrpay"]:checked',
        $form
      ).val();
      var upsellTitle =
        settings.title == ""
          ? ""
          : '<h2 class="upsell-title" style="color: ' +
            settings.buttomBackgroundColor +
            '"><span>' +
            settings.title +
            "</span></h2>\n";
      // Only do something if it's a single donation and
      // the amount is lower than maxLimit and bigger than minLimit
      if (
        recurrpay != "Y" &&
        amount < settings.maxLimit &&
        amount > settings.minLimit &&
        !$("#upsell-modal").length
      ) {
        var suggestedAmount = Math.max(Math.ceil((amount / 10) * 1.2), 10);
        suggestedAmount = Math.ceil(suggestedAmount / 5) * 5;
        var template =
          '<div class="upsell-container" id="upsell-modal" style="max-width: 850px; width: 85%; background-color: ' +
          settings.bodyBackgroundColor +
          '">\n' +
          '<div class="upsell-panel" style="background-image: url(' +
          settings.image +
          ');">\n' +
          "</div>\n" +
          '<div class="upsell-copy" style="color: ' +
          settings.bodyTextColor +
          "; background-color: " +
          settings.bodyBackgroundColor +
          ';">\n' +
          upsellTitle +
          "<p>" +
          settings.bodyText +
          "</p>\n" +
          '<h4 class="upsell-copy--cta" style="font-weight: bold; font-size: 17px;">' +
          settings.bodyHeading +
          "</h4>\n" +
          '<div class="upsell-recommendation">\n' +
          '<div class="upsell-recommendation--label" style="color: ' +
          settings.formTextColor +
          "; background-color: " +
          settings.formBackgroundColor +
          ';">\n' +
          '<div class="upsell-recommendation--amount">\n' +
          '<span class="upsell-recommendation-prefix">' +
          settings.inputPrefix +
          "</span>\n" +
          '<input type="text" class="upsell-monthly-amount">\n' +
          '<span class="upsell-recommendation-suffix">' +
          settings.inputSuffix +
          "</span>\n" +
          "</div>\n" +
          "</div>\n" +
          '<a href="#" class="upsell-confirm" style="color: ' +
          settings.buttomTextColor +
          "; background-color: " +
          settings.buttomBackgroundColor +
          ' ;">' +
          settings.buttonLabel +
          "</a>\n" +
          "</div>\n" +
          '<p class="upsell-no-thanks"><a href="#" class="upsell-deny">' +
          settings.denyLabel +
          "</a></p>\n" +
          "</div>\n" +
          '<button class="upsell-modal--close" style="background-color: ' +
          settings.bodyBackgroundColor +
          "; color: " +
          settings.bodyTextColor +
          '">×</button>' +
          "</div>";
        modal(template);
        $("#upsell-modal")
          .find(".upsell-monthly-amount")
          .val(suggestedAmount);
        $(
          "#4site_overlay, #upsell-modal .upsell-modal--close, #upsell-modal .upsell-deny"
        ).click(function(ev) {
          ev.preventDefault();
          ev.stopImmediatePropagation();
          upsellNo($form);
        });
        $(".upsell-confirm", "#upsell-modal").click(function(ev) {
          ev.preventDefault();
          ev.stopImmediatePropagation();
          upsellYes($form, $(".upsell-monthly-amount", "#upsell-modal").val());
        });
        return true;
      }
      return false;
    }
    return false;
  };

  // Return True if it's a valid Engaging Networks form
  function isEN(form) {
    return (
      form.hasClass("en__component") &&
      form.has('input[name="sessionId"]') &&
      form.has('input[name="transaction.recurrpay"]') &&
      form.has('input[name="transaction.donationAmt"]')
    );
  }

  // Modal
  function modal(el) {
    var overlay = $(
      "<div id='4site_overlay' style='position: fixed;z-index: 1000000;top: 0;left: 0;height: 100%;width: 100%;background: #000;display: none;'></div>"
    );
    $("body").append(overlay);
    $("body").append(el);
    var modal_id = "#upsell-modal";
    var modal_height = $(modal_id).outerHeight();
    var modal_width = $(modal_id).outerWidth();
    $("#4site_overlay").css({ display: "block", opacity: 0 });
    $("#4site_overlay").fadeTo(200, "0.5");
    $(modal_id).css({
      display: "block",
      position: "fixed",
      opacity: 0,
      "z-index": 1100000,
      left: 50 + "%",
      "margin-left": -(modal_width / 2) + "px"
    });
    $(modal_id).fadeTo(200, 1);
  }
  // Close Modal
  function close_modal() {
    $("#4site_overlay").fadeOut(200);
    $("#upsell-modal").css({ display: "none" });
  }
  // I want to Upsell!
  function upsellYes(form, amount) {
    // Close the Modal
    close_modal();
    // Set the Inputs
    $('input[name="transaction.recurrpay"]:checked', form).val("Y"); // Recurring = YES
    $('input[name="transaction.donationAmt"][value="other"]').prop(
      "checked",
      true
    ); // Check the "Other"
    $('input[name="transaction.donationAmt.other"]', form).val(
      parseFloat(amount)
    ); // Set the new amount
    updateDonationAmount();
    // Submit the form
    var submit_btn = $(".en__submit button", form);
    submit_btn.attr("disabled", false);
    submit_btn.html("Complete Donation");
    submit_btn.click();
  }
  // No, thank you
  function upsellNo(form) {
    // Close the Modal
    close_modal();
    // Submit the form
    var submit_btn = $(".en__submit button", form);
    submit_btn.attr("disabled", false);
    submit_btn.html("Complete Donation");
    submit_btn.click();
  }
})(jQuery);

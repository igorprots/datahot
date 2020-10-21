(function ($) {
    $.fn.initRegistration = function (options) {
        var _this = this,
            settings = $.extend({}, $.fn.initRegistration.defaults, options);

        $(_this).on('submit', function(e) {
            e.preventDefault();
            e.stopImmediatePropagation();

            var $btnSubmit = $(_this).find('button[type=submit]');

            //validation form
            if(settings.validatorForm(_this) === false) {
                return false;
            }

            $.ajax({
                url: $(_this).attr('action'),
                type: 'POST',
                dataType: 'json',
                data: $(_this).serialize(),
                beforeSend: function() {
                    settings.beforeSubmit();
                    _loading();
                    $btnSubmit.attr('disabled', 'disabled');
                },
                success: function(response) {
                    settings.afterSubmit();
                    _removeLoading();
                    $btnSubmit.removeAttr('disabled');

                    if (response.success === true) {
                        settings.onComplete(_this, response);
                        return;
                    }

                    settings.handlingServerReponseError(_this, response);
                }
            });
        });
    };

    var _validatorForm = function(form) {
        if (typeof Validator === 'undefined') {
            return true;
        }
        var validator = new Validator($(form), {});
        if (validator.checkForm() === true) {
            return false;
        }
        return true;
    };

    var _handlingServerReponseError = function(form, response) {
        $.each(response.errors, function(element, errors) {
            var errorKey = Object.keys(errors)[0],
                errorMsg = errors[errorKey],
                validator = new Validator(),
                $form = $(form),
                $btnSubmit = $form.find('button[type=submit]');
            
            if (element === 'unknown') {
                var customMsg = $btnSubmit.attr('data-' + errorKey + '-message');
                if ( typeof customMsg != 'undefined' ) {
                    errorMsg = customMsg;
                }
                _addUnknowErrorMessage($btnSubmit, errorMsg);
            }
            else {
                var customMsg = $('#' + element).attr('data-' + errorKey + '-message');
                if ( typeof customMsg != 'undefined' ) {
                    errorMsg = customMsg;
                }
                validator.addError('#' + element, errorMsg, $form);
            }
        });
    };

    var _loading = function() {
        $(document.body).find('.modal-overlay').addClass('hidden');
        $(document.body).append('<div class="lds-ripple"><span></span></div>');
    };

    var _removeLoading = function() {
        $(document.body).find('.modal-overlay').removeClass('hidden');
        $(document.body).find('.lds-ripple').remove();
    };

    var _addUnknowErrorMessage = function(obj, msg) {
        if ( obj.hasClass('js-add-unknow-msg-after') ) {
            obj.next('.unknown-error-msg').remove();
            obj.after('<span class="unknown-error-msg">' + msg + '</span>');
        }
        else {
            obj.prev('.unknown-error-msg').remove();
            obj.before('<span class="unknown-error-msg">' + msg + '</span>');
        }
    }

    $.fn.initRegistration.defaults = {
        validatorForm: function(form) {
            return _validatorForm(form);
        },
        handlingServerReponseError: function(form, response) {
            _handlingServerReponseError(form, response);
        },
        beforeSubmit: function () {
            
        },
        afterSubmit: function () {
            
        },
        onComplete: function () {
            
        },
    };
}(jQuery));
$(function () {
    //trigger enter keyboard go next step
    $('input, textarea').keydown(function (e) {
        if (e.keyCode == 13) {
            if (['country', 'zipCode', 'city'].includes($(this).attr('name'))) {
                e.preventDefault();
                return false;
            } else {
                var $btnNextStep = $(this).closest('.js-step').find('.js-next-step');

                if ($btnNextStep.length > 0) {
                    $btnNextStep.eq(0).trigger('click');
                    return false;
                }
            }
        }
    });

    // next step
    $('.js-step .js-next-step').on('click', function () {
        var $curStep = $(this).closest('.js-step'),
            $nextStep = $curStep.next('.js-step');

        if ($curStep.hasClass('js-validate-step') && typeof Validator !== 'undefined') {
            var validator = new Validator($curStep, {});
            if (validator.checkForm() === true) {
                return false;
            }
        }

        goToStep($nextStep, $curStep);
    });

    // previous step
    $('.js-step .js-prev-step').on('click', function () {
        var $curStep = $(this).closest('.js-step'),
            $nextStep = $curStep.prev('.js-step');
        goToStep($nextStep, $curStep);
    });
});

function goToStep($eleShown, $eleHidden) {
    //before go to next step
    if (typeof handleBeforeGoNextStep == 'function') {
        handleBeforeGoNextStep($eleShown, $eleHidden);
    }

    /* class 'step-hidden' use for hide step and make autofill form work */
    var hiddenClass = 'hidden';
    if ($eleShown.hasClass('step-hidden')) {
        hiddenClass = 'step-hidden';
    }
    $eleShown.removeClass('hidden step-hidden');
    $eleHidden.addClass(hiddenClass);
    //focus to the first input or select
    // $eleShown.find('input').eq(0).focus();

    //unfocus input that entering
    $eleHidden.find('input').blur();

    //active progress bar
    activeProgressBar($eleShown);

    //auto go to next step
    countdownToNextStep($eleShown);

    //after go to next step
    if (typeof handleAfterGoNextStep == 'function') {
        handleAfterGoNextStep($eleShown, $eleHidden);
    }
}

function countdownToNextStep($curStep) {
    var timeout = $curStep.attr('data-timeout');

    if ($curStep.hasClass('js-animation-step') && typeof timeout != 'undefined') {
        //count down to next step
        setTimeout(function () {
            var $nextStep = $curStep.next('.js-step');
            goToStep($nextStep, $curStep);
        }, timeout);
    }
}

function activeProgressBar($eleShown) {
    var $progressBar = $eleShown.closest('.registration-form-builder').find('.js-progress-bar');

    if ($progressBar.length > 0) {
        var indexCurStep = $eleShown.parent().find('.js-step').index($eleShown);
        $progressBar.find('li').removeClass('active').eq(indexCurStep).addClass('active visited');
    }
}
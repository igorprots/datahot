$(function() {
    var $regForm = $('.js-register-form');
    
    $('.js-open-register-form').on('click', function() {
        $regForm.removeClass('form-hidden hidden');
        if ($regForm.hasClass('js-overlay')) {
            $(document.body).find('.modal-overlay').remove();
            $(document.body).append('<div class="modal-overlay"></div>');
        }
    });
    $('.js-close-register-form').on('click', function() {
        $regForm.addClass('form-hidden');
        if ($regForm.hasClass('js-overlay')) {
            $(document.body).find('.modal-overlay').remove();
        }
    });

    $('input.js-visual-checked').on('keyup blur', function(e) {
        $(this).parent().addClass('visual-checked');

        var rules     = $(this).attr('data-validator').split('|'),
            value     = $(this).val(),
            validator = new Validator(),
            ruleError = '',
            error     = false;

        for (var i = 0; i < rules.length; i++) {
            var rule = rules[i],
                compare = $(this).attr('data-' + rule + '-compare');

            if (typeof compare != 'undefined') {
                if (!validator.methods[rule](value, compare)) {
                    error = true;
                    ruleError = rule;
                    break;
                }
            } else {
                if (!validator.methods[rule](value)) {
                    error = true;
                    ruleError = rule;
                    break;
                }
            }
        }

        if (error == false) {
            $(this).parent().addClass('visual-checked-success');

            if (e.type == 'blur')
                $(this).siblings('span.required').remove();
        } else {
            $(this).parent().removeClass('visual-checked-success');

            if (e.type == 'blur') {
                var message = $(this).data(ruleError.toLowerCase() + '-message');
                if (message) {
                    $(this).siblings('span.required').remove();
                    $(this).after('<span class="required">' + message + '</span>');
                }
            }
        }
    });
});

var x, i, j, l, ll, selElmnt, a, b, c;
/* Look for any elements with the class "custom-select": */
x = document.getElementsByClassName("custom-select");
l = x.length;
if (l > 0) {
    for (i = 0; i < l; i++) {
        selElmnt = x[i].getElementsByTagName("select")[0];
        ll = selElmnt.length;
        /* For each element, create a new DIV that will act as the selected item: */
        a = document.createElement("DIV");
        a.setAttribute("class", "select-selected");
        a.innerHTML = selElmnt.options[selElmnt.selectedIndex].innerHTML;
        x[i].appendChild(a);
        /* For each element, create a new DIV that will contain the option list: */
        b = document.createElement("DIV");
        b.setAttribute("class", "select-items select-hide");
        for (j = 0; j < ll; j++) {
            /* For each option in the original select element,
            create a new DIV that will act as an option item: */
            c = document.createElement("DIV");
            if (j == 0) {
                c.setAttribute("class", "same-as-selected");
            }
            c.innerHTML = selElmnt.options[j].innerHTML;
            c.addEventListener("click", function(e) {
                /* When an item is clicked, update the original select box,
                and the selected item: */
                var y, i, k, s, h, sl, yl;
                s = this.parentNode.parentNode.getElementsByTagName("select")[0];
                sl = s.length;
                h = this.parentNode.previousSibling;
                for (i = 0; i < sl; i++) {
                    if (s.options[i].innerHTML == this.innerHTML) {
                        s.selectedIndex = i;
                        h.innerHTML = this.innerHTML;
                        y = this.parentNode.getElementsByClassName("same-as-selected");
                        yl = y.length;
                        for (k = 0; k < yl; k++) {
                            y[k].removeAttribute("class");
                        }
                        this.setAttribute("class", "same-as-selected");
                        break;
                    }
                }
                h.click();
            });
            b.appendChild(c);
        }
        x[i].appendChild(b);
        a.addEventListener("click", function(e) {
            /* When the select box is clicked, close any other select boxes,
            and open/close the current select box: */
            e.stopPropagation();
            closeAllSelect(this);
            this.nextSibling.classList.toggle("select-hide");
            this.classList.toggle("select-arrow-active");
        });
    }
}

function closeAllSelect(elmnt) {
    /* A function that will close all select boxes in the document,
    except the current select box: */
    var x, y, i, xl, yl, arrNo = [];
    x = document.getElementsByClassName("select-items");
    y = document.getElementsByClassName("select-selected");
    xl = x.length;
    yl = y.length;
    for (i = 0; i < yl; i++) {
        if (elmnt == y[i]) {
            arrNo.push(i)
        } else {
            y[i].classList.remove("select-arrow-active");
        }
    }
    for (i = 0; i < xl; i++) {
        if (arrNo.indexOf(i)) {
            x[i].classList.add("select-hide");
        }
    }
}

/* If the user clicks anywhere outside the select box,
then close all select boxes: */
document.addEventListener("click", closeAllSelect);
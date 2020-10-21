var $btnOpenLogin    = document.getElementsByClassName('js-btn-open-login'),
    $btnCloseLogin   = document.getElementsByClassName('js-btn-close-login'),
    $loginFormHolder = document.getElementsByClassName('js-login-form-holder')[0],
    $errors          = document.getElementsByClassName('js-errors')[0],
    $formLogin       = document.getElementById('login-form'),
    iDates           = false;

//it use for iDates domain
if (document.getElementsByName('login_ident')[0]) {
    iDates = true;
}

for (var i = 0; i < $btnOpenLogin.length; i++) {
    $btnOpenLogin[i].addEventListener('click', function() {
        $loginFormHolder.classList.remove('hidden');
    }, false);
}

for (var i = 0; i < $btnCloseLogin.length; i++) {
    $btnCloseLogin[i].addEventListener('click', function() {
        $loginFormHolder.classList.add('hidden');
    }, false);
}

if ($formLogin) {
    $formLogin.onsubmit = function() {
        var $username = document.getElementsByName(iDates ? 'login_ident' : 'login_username')[0],
            username  = $username.value,
            $password = document.getElementsByName('login_password')[0],
            password  = $password.value,
            tracking  = document.getElementsByName('trk')[0].value,
            error     = false;
    
        var $eleErrorUsername = $username.parentNode.getElementsByClassName('required');
    
        if ($eleErrorUsername.length > 0) {
            $username.parentNode.removeChild($eleErrorUsername[0]);
        }
    
        if (username == '') {
            var msgUsername = $username.getAttribute('data-username-required-message');
            if (msgUsername != null && msgUsername != '') {
                loginFormAddRequiredError($username, msgUsername);
                error = true;
            }
        }
    
        var $eleErrorPassword = $password.parentNode.getElementsByClassName('required');
        
        if ($eleErrorPassword.length > 0) {
            $password.parentNode.removeChild($eleErrorPassword[0]);
        }
    
        if (password == '') {
            var msgPassword = $password.getAttribute('data-password-required-message');
            if (msgPassword != null && msgPassword != '') {
                loginFormAddRequiredError($password, msgPassword);
                error = true;
            }
        }
    
        if (error == false) {
            submitHttpRequest(username, password, tracking);
        }
        return false;
    };
}

function loginFormAddRequiredError($ele, msg) {
    var errorNode = document.createElement('span'),
        $eleError = $ele.parentNode.getElementsByClassName('required');

    if ($eleError.length > 0) {
        $ele.parentNode.removeChild($eleError[0]);
    }

    errorNode.className = 'required';
    errorNode.innerHTML = msg;
    $ele.parentNode.appendChild(errorNode);
}

function submitHttpRequest(username, pasword, tracking) {
    var xhttp = new XMLHttpRequest(),
        $btnSubmit = document.getElementById('login_submit'),
        params = (iDates ? 'ident' : 'username') + '=' + encodeURIComponent(username) +'&password=' + encodeURIComponent(pasword) + '&trk=' + tracking;

    if (iDates) {
        window.location = $formLogin.getAttribute('action') + '/login?' + params;
        return;
    }

    var loadingNode = document.createElement('div');
    loadingNode.appendChild(document.createElement('span'));
    loadingNode.className = 'login-form-loading';
    $formLogin.parentNode.appendChild(loadingNode);

    $btnSubmit.setAttribute('disabled', 'disabled');

    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var response = JSON.parse(this.responseText),
                errors   = response.errors,
                $eleLoading = $formLogin.parentNode.getElementsByClassName('login-form-loading');

            if ($eleLoading.length > 0) {
                $formLogin.parentNode.removeChild($eleLoading[0]);
            }

            $btnSubmit.removeAttribute('disabled');
            
            if (response.success == false) {
                if (errors.length > 0) {
                    var serverErrorMsg = errors[0],
                        msgType = 'data-login-fail-message';
                    switch(serverErrorMsg) {
                        case 'Username parameter cannot be empty.':
                            msgType = 'data-username-fail-message';
                            break;
                        case 'Password parameter cannot be empty.':
                            msgType = 'data-password-fail-message';
                            break;
                    }
                    
                    var msg = $btnSubmit.hasAttribute(msgType) ? $btnSubmit.getAttribute(msgType) : serverErrorMsg;
                    $errors.innerHTML = '<span class="required">' + msg + '</span>';
                }
            }
            else {
                window.location = response.url;
            }
        }
    };
    xhttp.open('POST', '/user/login', true);
    xhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xhttp.send(params);
}
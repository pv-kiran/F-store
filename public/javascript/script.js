// client side validation
let form = document.querySelector("#register_form");
let resendBtn = document.querySelector('.resend');
if(form) {
    form.addEventListener('submit' , function(e) {
        e.preventDefault(); 
        let isValid = validate();
        if(isValid) {
            document.querySelector("#register_form").submit();
        }
    })
}

function validate() {
    // var name = document.querySelector('#name').value;
    // var email = document.querySelector('#email').value;
    // var password = document.querySelector('#password').value;
    var err = document.querySelector('.error');
    var text ;
    var mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

    if(document.querySelector('#email')) {
        var email = document.querySelector('#email').value;
        if(email.match(mailformat) === null) {
            text = "Please enter a valid email";
            err.textContent = text ;
            err.style.height = '4rem';
            return false;
        }
    }

    if(document.querySelector('#name')) {
        var name = document.querySelector('#name').value;
        
        if( name.length < 5 ) {
            text = "Please enter a valid name";
            err.textContent = text ;
            err.style.height = '4rem';
            return false;
        }
        else if (!name.match(/^[A-Za-z]*\s{1}[A-Za-z]*$/)) {
        text = 'Write full name';
        err.textContent = text;
        err.style.height = '4rem';
        return false;
        }
    }

    
    if(document.querySelector('#password')) {
        var password = document.querySelector('#password').value;
        if(password.length < 5) {
            text = "Please enter a password";
            err.textContent = text ;
            err.style.height = '4rem';
            return false;
        }
    }
    


    if(document.querySelector('#confirmPswd')) {
        var confirmPswd = document.querySelector('#confirmPswd').value;
        // console.log(confirmPswd);
        // console.log(password);
        
        if( confirmPswd === '' ) {
            text = "Please cofirm the password";
            err.textContent = text ;
            err.style.height = '4rem';
            return false;
        }
        else if (confirmPswd != password ) {
            text = 'Please enter the correct password';
            err.textContent = text;
            err.style.height = '4rem';
            return false;
        }

    }
    if(document.querySelector('#otp')) {
        var otp = document.querySelector('#otp').value;
        // console.log(confirmPswd);
        // console.log(password);
        
        if( otp === '' ) {
            text = "Please enter OTP";
            err.textContent = text ;
            err.style.height = '4rem';
            return false;
        }
        else if (otp.length < 4 ) {
            text = 'Please enter 4 digit otp';
            err.textContent = text;
            err.style.height = '4rem';
            return false;
        }

    }
    
    return true;
}

if(resendBtn) {
    resendBtn.addEventListener('click' , async () => {
        const userEmail = resendBtn.dataset.url;
        console.log(userEmail);
        const url = `http://localhost:4000/user/newotp` ;
        console.log(url);
        const res = await fetch(url, {
                        method: 'PUT',
                        credentials: "same-origin",
                        headers: {
                        'Content-Type' : 'application/json'
                        },
                        body: JSON.stringify({
                         email: userEmail
                        })
                    })
                    .then(res =>res.text())
                    .then(data => document.write(data))
                    .catch(err => console.log(err))
                    ;
                    
        // const redirectPath = await res.json();
        // window.location.href = redirectPath.redirect;
        
    })
}











































































// navigation toggler
// const menuBtn = document.querySelector('#menu-btn');
// const navBar = document.querySelector('.nav-menu') 
// if(menuBtn) {
//     menuBtn.addEventListener('click' , () => {
//         console.log(2);
//         navBar.classList.toggle('active');
//     })
// }
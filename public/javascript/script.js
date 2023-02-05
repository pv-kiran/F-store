// client side validation
let registerForm = document.querySelector("#register_form");
let resendBtn = document.querySelector('.resend');
if(registerForm) {
    registerForm.addEventListener('submit' , function(e) {
        e.preventDefault(); 
        let isValid = validate();
        if(isValid) {
            document.querySelector("#register_form").submit();
        }
    })
}

// validation for user name in user edit form
const userUpdateForm = document.querySelector(".personal-info-form");
if(userUpdateForm) {
    userUpdateForm.addEventListener('submit' , function(e) {
        console.log('Submission of change username');
        e.preventDefault(); 
        let isValid = validate();
        if(isValid) {
            sendUserNameUpdateReq();
        }
    })
}

// request for changing the user name

async function sendUserNameUpdateReq(){
    const userId = document.getElementById('btn-username-change').dataset.url;
    console.log(userId);
    const url = `http://localhost:4000/profile/username/${userId}`;
    console.log(url);
    const res = await fetch(url, {
                    method: 'PUT',
                    credentials: "same-origin",
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        name: document.getElementById('name').value
                    })
                })
    const redirectPath = await res.json();
    window.location.href = redirectPath.redirect;
}

// validation for changing the password

const passwordForm = document.querySelector(".password-change-form");
if(passwordForm) {
    passwordForm.addEventListener('submit' , function(e) {
        console.log('Submission of change username');
        e.preventDefault(); 
        let isValid = validate();
        if(isValid) {
            sendChangePasswordRequest();
        }
    })
}


async function sendChangePasswordRequest(){
    // const userId = document.getElementById('btn-username-change').dataset.url;
    // console.log(userId);
    const url = `http://localhost:4000/profile/user/password`;
    console.log(url);
    const res = await fetch(url, {
                    method: 'PUT',
                    credentials: "same-origin",
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        password: document.getElementById('password').value
                    })
                })
    const redirectPath = await res.json();
    window.location.href = redirectPath.redirect;
}



// validation for user register and login
function validate() {
    // let name = document.querySelector('#name').value;
    // var email = document.querySelector('#email').value;
    // var password = document.querySelector('#password').value;
    let err = document.querySelector('.error');
    let addressErr = document.querySelector('.addr-error');
    let text ;
    let mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

    if(document.querySelector('#name')) {
        let name = document.querySelector('#name').value;
        
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

    if(document.querySelector('#email')) {
        let email = document.querySelector('#email').value;
        if(email.match(mailformat) === null) {
            text = "Please enter a valid email";
            err.textContent = text ;
            err.style.height = '4rem';
            return false;
        }
    }

   
    
    if(document.querySelector('#password')) {
        let password = document.querySelector('#password').value;
        if(password.length < 5) {
            text = "Please enter a password";
            err.textContent = text ;
            err.style.height = '4rem';
            return false;
        }
    }
    


    if(document.querySelector('#confirmPswd')) {
        let confirmPswd = document.querySelector('#confirmPswd').value;
        let password = document.querySelector('#password').value;
        console.log(confirmPswd);
        console.log(password);
        
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
        let otp = document.querySelector('#otp').value;
        
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


// Validation for address form and edit address form
const addressForm = document.querySelector(".adress-form");
if(addressForm) {
    addressForm.addEventListener('submit' , function(e) {
        console.log('Submission of change username');
        e.preventDefault(); 
        let isValid = addressvalidation();
        if(isValid) {
            document.querySelector(".adress-form").submit();
        }
    })
}


// updating the user address
let upadateAddressForm = document.querySelector('.adress-update-form');
if(upadateAddressForm) {
    upadateAddressForm.addEventListener('submit' , function(e) {
        e.preventDefault();
        let isValid = addressvalidation();
        if(isValid) {
            sendAddressUpdateReq();
        }
    })
}


// Request for address change
async function sendAddressUpdateReq(){
    const userId = document.getElementById('btn-address-update').dataset.url;
    console.log(userId);
    const url = `http://localhost:4000/profile/address/${userId}`;
    console.log(url);
    const res = await fetch(url, {
                    method: 'PUT',
                    credentials: "same-origin",
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        houseName: document.getElementById('houseName').value,
                        phone: document.getElementById('phone').value,
                        city: document.getElementById('city').value,
                        postalCode: document.getElementById('postalCode').value,
                        state: document.getElementById('state').value,
                        coutry: document.getElementById('coutry').value
                    })
                })
    const redirectPath = await res.json();
    window.location.href = redirectPath.redirect;
}


// Address validation
function addressvalidation() {
    let addressErr = document.querySelector('.addr-error');
    let text ;

    let phoneNumberformat = /^[6-9]{1}[0-9]{9}$/;
    let postalCodeFormat = /^[1-9][0-9]{5}$/ ;

    if(document.querySelector('#houseName')) {
        let houseName = document.querySelector('#houseName').value;
        
        if( houseName === '' ) {
            text = "Please enter house name";
            addressErr.textContent = text ;
            addressErr.style.height = '4rem';
            return false;
        }

    }

    if(document.querySelector('#phone')) {
        let phone = document.querySelector('#phone').value;
        
        if( phone === '' ) {
            text = "Please enter phone number";
            addressErr.textContent = text ;
            addressErr.style.height = '4rem';
            return false;
        }

        else if(phone.match(phoneNumberformat) === null) {
            console.log(phoneNumberformat);
            text = "Please enter a valid phone number";
            addressErr.textContent = text ;
            addressErr.style.height = '4rem';
            return false;
        }
        
        // phone number validation is required

    }

    if(document.querySelector('#city')) {
        let city = document.querySelector('#city').value;
        
        if( city === '' ) {
            text = "Please enter your city";
            addressErr.textContent = text ;
            addressErr.style.height = '4rem';
            return false;
        }

    }

    if(document.querySelector('#postalCode')) {
        let postalCode = document.querySelector('#postalCode').value;
        
        if( postalCode === '' ) {
            text = "Please enter your postal code";
            addressErr.textContent = text ;
            addressErr.style.height = '4rem';
            return false;
        }
        else if(postalCode.match(postalCodeFormat) === null) {
            text = "Please enter valid postal code";
            addressErr.textContent = text ;
            addressErr.style.height = '4rem';
            return false;
        }

    }

    if(document.querySelector('#state')) {
        let state = document.querySelector('#state').value;
        
        if( state === '' ) {
            text = "Please enter your state name";
            addressErr.textContent = text ;
            addressErr.style.height = '4rem';
            return false;
        }

    }

    if(document.querySelector('#coutry')) {
        let coutry = document.querySelector('#coutry').value;
        
        if( coutry === '' ) {
            text = "Please enter your postal code";
            addressErr.textContent = text ;
            addressErr.style.height = '4rem';
            return false;
        }

    }

    return true;

}


// OTP RESEND
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


// NAVBAR RESPONSIVENESS
const btnToggler = document.querySelector('.btn-toggler');
if(btnToggler) {
    btnToggler.addEventListener('click' , () => {
        const navContainer = document.querySelector('.nav-container ');
        const navList = document.querySelector('.nav-list');
        navContainer.classList.toggle('active');
        navList.classList.toggle('active');
    })
}



// CHANGING IMAGES ON CLICK
let imageContainer = document.querySelector('.product-sub-img');
// console.log(imageContainer);
if(imageContainer) {
    imageContainer.addEventListener('click' , (e) => {

        if(e.target.classList.contains('sub-img')) {
          let subImg = e.target.src ;
          let mainImg = document.querySelector('.mainImg').getAttribute('src') ;
          e.target.src = mainImg ;
          document.querySelector('.mainImg').src = subImg ;  
        }  
    })
}



//removing the address
let addressContainer = document.querySelector('.address-container');
if(addressContainer) {
    console.log('clicked');
    addressContainer.addEventListener('click' , (e) => {
        if(e.target.classList.contains('address-remove')) {
             removeAddress(e);
        }   
    })
}

// request for removing address
async function removeAddress(e) {
    const userId = e.target.dataset.url;
    console.log(userId);
    const url = `http://localhost:4000/profile/address/${userId}`;
    console.log(url);
    const res = await fetch(url, {
                    method: 'DELETE',
                    credentials: "same-origin",
                    headers: {
                    'Content-Type' : 'application/json'
                    }
                });
                
    const redirectPath = await res.json();
    window.location.href = redirectPath.redirect;
    
}


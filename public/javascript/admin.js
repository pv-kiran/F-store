// NAvigation toggler
const menuBtn = document.querySelector('#menu-btn');
const navBar = document.querySelector('.nav-menu') 
if(menuBtn) {
    menuBtn.addEventListener('click' , () => {
        console.log(2);
        navBar.classList.toggle('active');
    })
}

// Validation for adding the product 
let productForm = document.querySelector("#product_form");
if(productForm) {
    console.log('Hello');
    productForm.addEventListener('submit' , function(e) {
        e.preventDefault(); 
        let isValid = productValidate(true);
        if(isValid) {
            console.log('Submission');
            document.querySelector("#product_form").submit();
        }
    })
}


// Validation for updating the product
let productUpdateForm = document.querySelector("#product_update_form");
if(productUpdateForm) {
    console.log('Hello');
    productUpdateForm.addEventListener('submit' , function(e) {
        e.preventDefault(); 
        let isValid = productValidate(false);
        if(isValid) {
            console.log('Submission');
            document.querySelector("#product_update_form").submit();
        }
    })
}

// validation for product
function productValidate(isAddProduct) {
    let err = document.querySelector('.error');
    let text ;
    console.log('Hello Validate');
    if(document.querySelector('#productName')) {
        var name = document.querySelector('#productName').value;
        if( name === '' ) {
            text = "Please enter a product name";
            err.textContent = text ;
            err.style.height = '4rem';
            return false;
        }
    }

    if(document.querySelector('#price')) {
        console.log('Price');
        var price = document.querySelector('#price').value;
        if(price === '') {
            text = "Please add the price";
            err.textContent = text ;
            err.style.height = '4rem';
            return false;
        }
    }
    if(document.querySelector('#material')) {
        var material = document.querySelector('#material').value;
        
        if( material === '' ) {
            text = "Please add the material";
            err.textContent = text ;
            err.style.height = '4rem';
            return false;
        }

    }
    if(document.querySelector('#manufacturedBy')) {
        var manufacturedBy = document.querySelector('#manufacturedBy').value;
        
        if( manufacturedBy === '' ) {
            text = "Please add manufactured by field";
            err.textContent = text ;
            err.style.height = '4rem';
            return false;
        }
    }
    if(document.querySelector('#marketedBy')) {
        var manufacturedBy = document.querySelector('#marketedBy').value;
        
        if( marketedBy === '' ) {
            text = "Please add marketed by field";
            err.textContent = text ;
            err.style.height = '4rem';
            return false;
        }
    }
    if(document.querySelector('#stock')) {
        var stock = document.querySelector('#stock').value;
        
        if( stock === '' ) {
            text = "Please enter stock";
            err.textContent = text ;
            err.style.height = '4rem';
            return false;
        }
    }
    if(document.querySelector('#productDimension')) {
        var productDimension = document.querySelector('#productDimension').value;
        
        if( productDimension === '' ) {
            text = "Please add product dimension";
            err.textContent = text ;
            err.style.height = '4rem';
            return false;
        }
    }
    if(document.querySelector('#countryOfOrigin')) {
        var countryOfOrigin = document.querySelector('#countryOfOrigin').value;
        
        if( countryOfOrigin === '' ) {
            text = "Please enter country of origin";
            err.textContent = text ;
            err.style.height = '4rem';
            return false;
        }
    }
    if(document.querySelector('#description')) {
        var description = document.querySelector('#description').value;
        
        if( description === '' ) {
            text = "Please enter the product description";
            err.textContent = text ;
            err.style.height = '4rem';
            return false;
        }
    }


    if(isAddProduct) {
        if(document.querySelector('#imagefile')) {

            let imageFile = document.querySelector('#imagefile');
            console.log(imageFile.files.length);
            if( imageFile.files.length < 4) {
                text = "Please upload product images";
                err.textContent = text ;
                err.style.height = '4rem';
                return false;
            }
    
            for (var i = 0; i < imageFile.files.length; i++) {
                var f = imageFile.files[i];
                if (!endsWith(f.name, 'jpg') && !endsWith(f.name,'png') && !endsWith(f.name,'webp') && !endsWith(f.name,'avif')) {
                    // alert(f.name + " is not a valid file!");
                    // console.log('wrong image type');
                    text = "Please upload png , jpg or avif files only";
                    err.textContent = text ;
                    err.style.height = '4rem';
                    return false;
                } 
            }
        }
    } else {
        if(document.querySelector('#imagefile')) {

            let imageFile = document.querySelector('#imagefile');
            console.log(imageFile.files.length);
            if( ( imageFile.files.length  > 0 ) && (imageFile.files.length  < 4)) {
                text = "Please upload atleast four images";
                err.textContent = text ;
                err.style.height = '4rem';
                return false;
            }

            else if(imageFile.files.length  === 4) {
                for (var i = 0; i < imageFile.files.length; i++) {
                    var f = imageFile.files[i];
                    if (!endsWith(f.name, 'jpg') && !endsWith(f.name,'png') && !endsWith(f.name,'avif')) {
                        // alert(f.name + " is not a valid file!");
                        // console.log('wrong image type');
                        text = "Please upload png , jpg or avif files only";
                        err.textContent = text ;
                        err.style.height = '4rem';
                        return false;
                    } 
                }
            }
    
            
        }
    }

    

    function endsWith(str, suffix) {
        return str.indexOf(suffix, str.length - suffix.length) !== -1;
    }


    return true;
}


// Blocking/Unblocking the user 
let editItems = document.querySelector('table');
const popUp = document.querySelector('#popup');
const hideAlert = document.querySelector('.btn-confirm');
if(editItems) {
    editItems.addEventListener('click' , (e) => {
        if(e.target.classList.contains('block')) {
            popUp.classList.add('open_popup');
            hideAlert.addEventListener('click' , () => {
                popUp.classList.remove('open_popup');
                blockUser(e);
            })
        }
        else if(e.target.classList.contains('unblock')) {
            popUp.classList.add('open_popup');
            hideAlert.addEventListener('click' , () => {
                popUp.classList.remove('open_popup');
                blockUser(e);
            })
        }    
    })
}

async function blockUser(e) {
    const userId = e.target.dataset.url;
    console.log(userId);
    const url = `http://localhost:4000/admin/user/${userId}` ;
    console.log(url);
    const res = await fetch(url, {
                    method: 'PUT',
                    credentials: "same-origin",
                    headers: {
                    'Content-Type' : 'application/json'
                    }
                });
                
    const redirectPath = await res.json();
    window.location.href = redirectPath.redirect;
    
}


//

// Blocking/Unblocking the products
let actionItems = document.querySelector('table');

if(actionItems) {
    actionItems.addEventListener('click' , (e) => {

        if(e.target.classList.contains('btn-block')) {
            popUp.classList.add('open_popup');
            hideAlert.addEventListener('click' , () => {
                popUp.classList.remove('open_popup');
                blockProducts(e);
            })
        }  
    })
}

async function blockProducts(e) {
    const userId = e.target.dataset.url;
    console.log(userId);
    const url = `http://localhost:4000/admin/productstatus/${userId}` ;
    console.log(url);
    const res = await fetch(url, {
                    method: 'PUT',
                    credentials: "same-origin",
                    headers: {
                    'Content-Type' : 'application/json'
                    }
                });
                
    const redirectPath = await res.json();
    window.location.href = redirectPath.redirect;
    
}



// changing the status of categories
let editCategory = document.querySelector('table');

if(editCategory) {
    editCategory.addEventListener('click' , (e) => {

        if(e.target.classList.contains('btn-category-block')) {
            popUp.classList.add('open_popup');
            hideAlert.addEventListener('click' , () => {
                popUp.classList.remove('open_popup');
                changeCategoryStatus(e);
            })
        }  
    })
}

async function changeCategoryStatus(e) {
    const userId = e.target.dataset.url;
    console.log(userId);
    const url = `http://localhost:4000/admin/categorystatus/${userId}` ;
    console.log(url);
    const res = await fetch(url, {
                    method: 'PUT',
                    credentials: "same-origin",
                    headers: {
                    'Content-Type' : 'application/json'
                    }
                });
                
    const redirectPath = await res.json();
    window.location.href = redirectPath.redirect;
    
}


// Cancelling the orders
let orderItems = document.querySelector('table');
if(orderItems) {
    orderItems.addEventListener('click' , (e) => {
        if(e.target.classList.contains('order-cancel-btn')) {
                orderCancell(e);
        }
        else if(e.target.classList.contains('order-delivered-btn')) {
                orderDeliver(e);
        }    
        else if(e.target.classList.contains('tracking_info')) {
            e.target.addEventListener('change' , (e) => {
               updateTrackingInfo(e);
            })
        }
    })
}

async function updateTrackingInfo(e) {
    const orderId = e.target.dataset.url;
    console.log(orderId);
    console.log('called');
    const url = `http://localhost:4000/admin/order/tracking/${orderId}` ;
    // console.log(url);
    // console.log(document.getElementById('tracking_info').value);
    const res = await fetch(url, {
                    method: 'PUT',
                    credentials: "same-origin",
                    headers: {
                    'Content-Type' : 'application/json'
                    } ,
                    body: JSON.stringify({
                        tracking_info: e.target.value
                    })
                });
                

    
    const redirectPath = await res.json();
    console.log(redirectPath);
    window.location.href = redirectPath.redirect;
    
}


async function orderCancell(e) {
    const orderId = e.target.dataset.url;
    console.log(orderId);
    const url = `http://localhost:4000/admin/order/cancel/${orderId}` ;
    console.log(url);
    const res = await fetch(url, {
                    method: 'PUT',
                    credentials: "same-origin",
                    headers: {
                    'Content-Type' : 'application/json'
                    }
                });
                
    const redirectPath = await res.json();
    window.location.href = redirectPath.redirect;
    
}

async function orderDeliver(e) {
    const orderId = e.target.dataset.url;
    console.log(orderId);
    const url = `http://localhost:4000/admin/order/deliver/${orderId}` ;
    console.log(url);
    const res = await fetch(url, {
                    method: 'PUT',
                    credentials: "same-origin",
                    headers: {
                    'Content-Type' : 'application/json'
                    }
                });
                
    const redirectPath = await res.json();
    window.location.href = redirectPath.redirect;
    
}


// changing the date format


// changing the date format
const dateContainer = document.querySelectorAll('.date');
if(dateContainer) {
    for (let index = 0; index < dateContainer.length; index++) {
        const element = dateContainer[index];
        let date = new Date(element.textContent.replace('IST', ''));
        let day = date.getDate();
        let month = date.getMonth()+1;
        let year = date.getFullYear();
        element.textContent = day+"-"+month+"-"+ year ;
    }
}


// coupon delete
let couponItems = document.querySelector('table');
if(couponItems) {
    couponItems.addEventListener('click' , (e) => {
        if(e.target.classList.contains('coupon-block')) {
                couponActivate(e);
        }
    })
}

async function couponActivate(e) {
    const couponId = e.target.dataset.url;
    console.log(couponId);
    console.log('called');
    const url = `http://localhost:4000/admin/updatecoupon/${couponId}`;
    const res = await fetch(url, {
                    method: 'PUT',
                    credentials: "same-origin",
                    headers: {
                    'Content-Type' : 'application/json'
                    }
                });
                

    
    const redirectPath = await res.json();
    window.location.href = redirectPath.redirect;
    
}


// orffer clearance product
let offerItems = document.querySelector('table');
if(offerItems) {
    offerItems.addEventListener('click' , (e) => {
        if(e.target.classList.contains('btn-clear')) {
                offerClear(e);
        }
    })
}

// product offer clear
async function offerClear(e) {
    const productId = e.target.dataset.url;
    console.log(productId);
    console.log('called');
    const url = `http://localhost:4000/admin/offer/${productId}`;
    const res = await fetch(url, {
                    method: 'PUT',
                    credentials: "same-origin",
                    headers: {
                    'Content-Type' : 'application/json'
                    }
                });
                

    
    const redirectPath = await res.json();
    window.location.href = redirectPath.redirect;
}


let categoryOffer = document.querySelector('table');
if(categoryOffer) {
    categoryOffer.addEventListener('click' , (e) => {
        if(e.target.classList.contains('btn-category-clear')) {
                categoryOfferClear(e);
        }
    })
}


// category offer clear
async function categoryOfferClear(e) {
    const categoryId = e.target.dataset.url;
    console.log(categoryId);
    const url = `http://localhost:4000/admin/categoryoffer/${categoryId}`;
    console.log(url);
    const res = await fetch(url, {
                    method: 'PUT',
                    credentials: "same-origin",
                    headers: {
                    'Content-Type' : 'application/json'
                    }
                });
                
    const redirectPath = await res.json();
    window.location.href = redirectPath.redirect;
}




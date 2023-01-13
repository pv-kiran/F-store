// NAvigation toggler
const menuBtn = document.querySelector('#menu-btn');
const navBar = document.querySelector('.nav-menu') 
if(menuBtn) {
    menuBtn.addEventListener('click' , () => {
        console.log(2);
        navBar.classList.toggle('active');
    })
}

console.log('Hello');


let form = document.querySelector("#product_form");
if(form) {
    form.addEventListener('submit' , function(e) {
        e.preventDefault(); 
        let isValid = validate();
        if(isValid) {
            document.querySelector("#product_form").submit();
        }
    })
}

function validate() {
    var err = document.querySelector('.error');
    var text ;

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
        var price = document.querySelector('#price').value;
        if(price.length === '') {
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
    if(document.querySelector('#imagefile')) {
        var imageFile = document.querySelector('#imagefile');
        console.log(imageFile.files.length);
        if( imageFile.files.length < 2) {
            text = "Please upload product images";
            err.textContent = text ;
            err.style.height = '4rem';
            return false;
        }
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

// Blocking/Unblocking the user 
let actionItems = document.querySelector('table');
console.log(actionItems);
if(actionItems) {
    actionItems.addEventListener('click' , (e) => {

        if(e.target.classList.contains('btn-block')) {
            console.log('Heloo');
                blockProducts(e);
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
// changing the date format
const dateContainer = document.querySelectorAll('.date');
for (let index = 0; index < dateContainer.length; index++) {
    const element = dateContainer[index];
    let date = new Date(element.textContent.replace('IST', ''));
    let day = date.getDate();
    let month = date.getMonth()+1;
    let year = date.getFullYear();
    element.textContent = 'Ordered On' + " " + day+"-"+month+"-"+ year ;
}

// automaticaly selecting an address
let addressRadio = document.getElementById('address');
if(addressRadio) {
  addressRadio.checked = true;
}


// hiding / displaying the add address form
 let shippingAddressForm = document.getElementById('adress-form');
 if(shippingAddressForm) {
    shippingAddressForm.style.display = 'none';
 }

 let addressShowbtn = document.querySelector('.btn-address-show');
 if(addressShowbtn) {
    addressShowbtn.addEventListener('click' , (e) => {
        shippingAddressForm.style.display = 'block';
     })
 }
 


// creating an order for cash on delivery
let codBtn = document.querySelector('.btn-cod');
if(codBtn){
    codBtn.addEventListener('click' , (e) => {
        createOrder(e);
    }) 
}

//  creating an order for 
let btnRazor = document.querySelector('.btn-razor');
if(btnRazor) {
    btnRazor.addEventListener('click' , (e) => {
        createOrder(e);
    })
}


async function createOrder(e) {

    const url = `/order/create`;
    let methodOfPayment;
    if(e.target.classList.contains('btn-cod')) {
         methodOfPayment = 'Cash on delivery';
    }
    else if(e.target.classList.contains('btn-razor')) {
         methodOfPayment = 'Razor Pay';
    }

    console.log(methodOfPayment);
    const res = await fetch(url, {
                    method: 'POST',
                    credentials: "same-origin",
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        totalAmount: document.querySelector('.order-price').textContent ,
                        paymentMethod: methodOfPayment ,
                        shippingInfo: document.querySelector('input[name="address"]:checked').value
                    })
                })
    const redirectPath = await res.json();
    // console.log(redirectPath.myOrder);

    if(redirectPath.myOrder) {
        
        console.log(redirectPath.myOrder)
        var options = {
            key: "rzp_test_I7TMRHjNEnfLbl", // Key ID
            amount: redirectPath.myOrder.amount * 100, // Amount is in paise
            currency: "INR",
            order_id: redirectPath.myOrder.id,
            modal: {
                ondismiss: function(){
                    cancelOrder(redirectPath.myOrder.id);
                }
            }, 
            handler: function(response) {
                orderSuccess(response.razorpay_order_id ,response.razorpay_payment_id); 
                // window.location.href = redirectPath.redirect;
            }
        };
        var rzp1 = new Razorpay(options);
        rzp1.open();
        

    } else {
        window.location.href = redirectPath.redirect;
    }
}


// payment succcess
async function orderSuccess(orderId , paymentId) {
    const url = `/order/success/${orderId}`;
    console.log(orderId);
    console.log(paymentId);
    const res = await fetch(url, {
                    method: 'PUT',
                    credentials: "same-origin",
                    headers: {
                    'Content-Type' : 'application/json'
                    } ,
                    body: JSON.stringify({
                        paymentId : paymentId
                    })
                });

    const redirectPath = await res.json();
    window.location.href = redirectPath.redirect;
    
}

// removing / cancelling order
let orderContainer = document.querySelector('.userorder-container');
if(orderContainer) {
    orderContainer.addEventListener('click' , (e) => {
        if(e.target.classList.contains('order-cancel-btn')) {
             removeOrder(e);
        }
    })
}
async function removeOrder(e) {
    const orderId = e.target.dataset.url;
    console.log(orderId);
    const url = `/order/cancel/${orderId}`;
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


// remove / cancel order
async function cancelOrder(orderId) {
    console.log(orderId);
    const url = `/order/cancel/${orderId}`;
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

// initiating return option
let returnContainer = document.querySelector('.userorder-container');
if(returnContainer) {
    returnContainer.addEventListener('click' , (e) => {
        if(e.target.classList.contains('return-offer')) {
            returnOrder(e);
        }
    })
}

async function returnOrder(e) {
    const orderId = e.target.dataset.url;
    console.log(orderId);
    const url = `/order/return/${orderId}`;
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


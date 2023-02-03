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

// let date = new Date(dateContainer.replace('IST', ''));
// let day = date.getDate();
// let month = date.getMonth()+1;
// let year = date.getFullYear();
// document.querySelector('.date').textContent = year+"-"+month+"-"+day ;
// console.log(year+"-"+month+"-"+day)


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

    const url = `http://localhost:4000/order/create`;
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
            order_id: redirectPath.myOrder.id, //This is a sample Order ID
            handler: function() {
                window.location.href = redirectPath.redirect;
            }
        };
        var rzp1 = new Razorpay(options);
        rzp1.open();
        

    } else {
        window.location.href = redirectPath.redirect;
    }
   








    // window.location.href = redirectPath.redirect;
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
    const url = `http://localhost:4000/order/cancel/${orderId}`;
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


// automaticaly selecting an address
let addressRadio = document.getElementById('address');
addressRadio.checked = true;


// hiding / displaying the add address form
 let addressForm = document.getElementById('adress-form');
 addressForm.style.display = 'none';

 let addressShowbtn = document.querySelector('.btn-address-show');
 addressShowbtn.addEventListener('click' , (e) => {
    addressForm.style.display = 'block';
 })
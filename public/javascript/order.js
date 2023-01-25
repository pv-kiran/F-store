let codBtn = document.querySelector('.btn-cod');

if(codBtn){
    codBtn.addEventListener('click' , () => {
        createOrder();
    }) 
}



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





async function createOrder() {
    const url = `http://localhost:4000/order/create`;
    console.log(url);
    const res = await fetch(url, {
                    method: 'POST',
                    credentials: "same-origin",
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        totalAmount: document.querySelector('.order-price').textContent ,
                        paymentMethod: 'Cash on delivery' ,
                        shippingInfo: document.querySelector('input[name="address"]:checked').value
                    })
                })
    const redirectPath = await res.json();
    window.location.href = redirectPath.redirect;
}



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
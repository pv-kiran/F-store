console.log(1);


let codBtn = document.querySelector('.btn-cod');
if(codBtn){
    codBtn.addEventListener('click' , () => {
        createOrder();
    }) 
}




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
    // const redirectPath = await res.json();
    // window.location.href = redirectPath.redirect;
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

    // const redirectPath = await res.json();
    // window.location.href = redirectPath.redirect;
    
}
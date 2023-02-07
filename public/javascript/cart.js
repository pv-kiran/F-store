console.log(1);

let cartCard = document.querySelector('.cart-items-container');
console.log(cartCard)
if(cartCard) {
    
    cartCard.addEventListener('click' , (e) => {
        console.log('clicking')
        console.log(e.target);
        if(e.target.classList.contains('delete-btn')) {
            removeFromCart(e);
        }
        else if(e.target.classList.contains('quantity-up')) {
            incQuantity(e);
        } 
        else if(e.target.classList.contains('quantity-down')) {
            decQuantity(e);
        }    
    })
}


async function removeFromCart(e) {
    const productId = e.target.dataset.url;
    const url = `/cart/${productId}` ;
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

async function incQuantity(e) {
    const productId = e.target.dataset.url;
    console.log(productId);
    const url = `/cart/inc/${productId}` ;
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

async function decQuantity(e) {
    const productId = e.target.dataset.url;
    console.log(productId);
    const url = `/cart/dec/${productId}` ;
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
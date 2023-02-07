let cartCard = document.querySelector('.cart-items-container');
if(cartCard) {
    
    cartCard.addEventListener('click' , (e) => {
        
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
    const url = `/cart/inc/${productId}` ;
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
    const url = `/cart/dec/${productId}` ;
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
// NAvigation toggler
const menuBtn = document.querySelector('#menu-btn');
const navBar = document.querySelector('.nav-menu') 
if(menuBtn) {
    menuBtn.addEventListener('click' , () => {
        console.log(2);
        navBar.classList.toggle('active');
    })
}



// Blocking/Unblocking the user 
let editItems = document.querySelector('table');
const popUp = document.querySelector('#popup');
const hideAlert = document.querySelector('.btn-confirm');
console.log(editItems);
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
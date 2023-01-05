const menuBtn = document.querySelector('#menu-btn');
const navBar = document.querySelector('.nav-menu') 
menuBtn.addEventListener('click' , () => {
    console.log(2);
    navBar.classList.toggle('active');
})
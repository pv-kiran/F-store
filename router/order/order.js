const express = require('express');
const router = express.Router();


const { getOrderDetails , 
        newShippingAddress , 
        createOrder , 
        getUserOrder, 
        cancelOrder, 
        orderSuccess ,
        applyCoupon } = require('../../controllers/orderController');

        
const { isLoggedIn } = require('../../middlewares/authmiddleware');




// Order details page
router.get('/' ,isLoggedIn ,getOrderDetails );

//adding new address from order details page
router.post('/address/:id' , isLoggedIn , newShippingAddress );


// applying coupon before crating order
router.post('/coupon' , isLoggedIn , applyCoupon)

// Placing the orders
router.post('/create' , isLoggedIn , createOrder);

// get user specific order
router.get('/myorder', isLoggedIn,getUserOrder ) ;

//cancelling the order
router.put('/cancel/:id' , isLoggedIn  , cancelOrder); 

router.get('/success' , isLoggedIn ,  orderSuccess);


module.exports= router;
const express = require('express');
const router = express.Router();




const { getOrderDetails , 
        newShippingAddress , 
        createOrder , 
        getUserOrder, 
        razorPaySuccess,
        cancelOrder, 
        orderSuccess ,
        returnOrder ,
        removeOrder ,
        applyCoupon ,} = require('../../controllers/orderController');

        
const { isLoggedIn } = require('../../middlewares/authmiddleware');
const Order = require('../../models/order');




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

// returning the order
router.put('/return/:id' , isLoggedIn , returnOrder )

// deleting the order
router.delete('/cancel/:id' , isLoggedIn  , removeOrder); 

// razorpay success
router.put('/success/:id' , isLoggedIn , razorPaySuccess );


// order success
router.get('/success' , isLoggedIn ,  orderSuccess);


module.exports= router;
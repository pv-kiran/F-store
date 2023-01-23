const express = require('express');
const router = express.Router();


const { getOrderDetails , 
        newShippingAddress , 
        createOrder , 
        getUserOrder, 
        cancelOrder, 
        orderSuccess} = require('../../controllers/orderController')


// Order details page
router.get('/' , getOrderDetails );

//adding new address from order details page
router.post('/address/:id' , newShippingAddress );

// Placing the orders
router.post('/create' , createOrder);

// get user specific order
router.get('/myorder', getUserOrder ) ;

//cancelling the order
router.put('/cancel/:id' , cancelOrder); 

router.get('/success' , orderSuccess);


module.exports= router;
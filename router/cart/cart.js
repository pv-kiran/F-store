const express = require('express');
const router = express.Router();

const { getCart , addToCart ,cartIncrement, cartDecrement , cartDelete } = require('../../controllers/cartController')

router.get( '/' , getCart );
router.get('/:id' , addToCart );
router.put('/inc/:id' , cartIncrement );
router.put('/dec/:id' , cartDecrement);
router.delete('/:id' , cartDelete)















module.exports = router;






// let res = user[0].cart.forEach((item) => {
            //     if(item.id.valueOf() === `${id}`) {
            //         item.quantity = item.quantity+1 ;
            //         return true ;
            //     } else {
            //         return false;
            //     }
            // })
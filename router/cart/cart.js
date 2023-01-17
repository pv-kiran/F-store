const express = require('express');
const router = express.Router();

const { getCart , addToCart ,cartIncrement, cartDecrement , cartDelete } = require('../../controllers/cartController')

const {isLoggedIn} = require('../../middlewares/authmiddleware');

router.get( '/' , isLoggedIn , getCart );
router.get('/:id' , isLoggedIn , addToCart );
router.put('/inc/:id' , isLoggedIn, cartIncrement );
router.put('/dec/:id' , isLoggedIn , cartDecrement);
router.delete('/:id' , isLoggedIn , cartDelete);















module.exports = router;






// let res = user[0].cart.forEach((item) => {
            //     if(item.id.valueOf() === `${id}`) {
            //         item.quantity = item.quantity+1 ;
            //         return true ;
            //     } else {
            //         return false;
            //     }
            // })
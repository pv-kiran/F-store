const express = require('express');
const router = express.Router();
const User = require('../../models/user')

router.get('/' , async (req,res) => {
    const user = await User.find({email: req.session.userid}).populate('cart.id');
    const cartItems = user[0].cart ;
    console.log(cartItems);

    res.render('cart' , {cartItems : cartItems});
})

router.get('/:id' , async (req,res) => {
    const {id} = req.params ;
    // const user = await User.find({email: req.session.userid});
    // console.log(user[0].cart[0]);
    try {
        const user = await User.find({email: req.session.userid});
        const item = {
            id: id ,
            quantity: 1
        };
        if(user[0].cart.length === 0) {
            user[0].cart.push(item);
            user[0].save();
        } else {
            
            const res = user[0].cart.findIndex((item) => {
                return item.id.valueOf() === `${id}`
            })

            if(res === -1) {
                user[0].cart.push(item);
            } else {
                user[0].cart[res].quantity = user[0].cart[res].quantity + 1;
            }
            
            user[0].save();

            // console.log(res);
            // user[0].save()
        }
    } catch(e) {
        console.log(e);
    }

    // console.log(1);
    

    
})


module.exports = router;






// let res = user[0].cart.forEach((item) => {
            //     if(item.id.valueOf() === `${id}`) {
            //         item.quantity = item.quantity+1 ;
            //         return true ;
            //     } else {
            //         return false;
            //     }
            // })
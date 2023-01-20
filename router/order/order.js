const express = require('express');
const router = express.Router();
const User = require('../../models/user');


router.get('/' , async (req,res) => {

    let isLoggedIn;
    if(req.session.userid) {
      isLoggedIn = true
    } else {
        isLoggedIn = false
    }

    try {

        const user = await User.find({email: req.session.userid}).populate('cart.id');
        user[0].cart.forEach((item) => {
            if(item.quantity >= item.id.stock) {
                console.log(item.quantity) ;
                console.log(item.id.stock);
            }
        }) ;
        const cartItems = user[0].cart.filter(item => item.id.isBlocked === false);
        console.log(cartItems)
        const totalQuantity = cartItems.reduce((total , item) => {
            return total+item.quantity;
        } , 0);
        const totalPrice = cartItems.reduce((total , item) => {
            return total+ (item.quantity * item.id.price) 
        } , 0);
        cartItems.forEach((item) => {
            if(item.quantity >= item.id.stock) {
                console.log(item.quantity);
                console.log(item.id.stock)
                item.isUpDisable = true
            } 
            else if(item.quantity === 1) {
                item.isDownDisable = true;
            }
        })
        console.log(cartItems);
        res.render('orderdetails' , {user: user[0] ,cartItems : cartItems , totalQuantity: totalQuantity , totalPrice: totalPrice , isLoggedIn: isLoggedIn , id: req.session._userId});
    } catch (e) {
        console.log(e);
    }
    
})

router.post('/address/:id' , async (req,res) => {
    const {id} = req.params;
    try {
        const user = await User.find({_id: id});
        user[0].address.push(req.body);
        user[0].save();
        res.redirect(`/`);
    } catch(e) {
        console.log(e);
    }
})





module.exports= router;
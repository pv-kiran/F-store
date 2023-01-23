const express = require('express');
const router = express.Router();
const Product = require('../../models/product');


router.get('/' , async (req,res) => {
    let isLoggedIn;
    if(req.session.userid) {
      isLoggedIn = true
    } else {
        isLoggedIn = false
    }
    try {
        const product = await Product.find({ isBlocked: false , stock: {$gt: 0}}).limit(4);
        res.render('home' , {productList : product , id: req.session._userId , isLoggedIn: isLoggedIn});
    } catch (e) {
        console.log(e);
    }
    
})






module.exports = router ;
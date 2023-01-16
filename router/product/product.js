const express = require('express');
const router = express.Router();
const Product = require('../../models/product');

router.get('/' , async (req,res) => {
    try {
        const product = await Product.find({isBlocked: false});
        console.log(product);
        res.render('allproducts' , {productList: product , id: req.session._userId});
    } catch(e) {
        console.log(e);
    }
    
})

router.get('/:id' , async (req,res) => {
    const {id} = req.params ;
    try {
        const product = await Product.findById({_id: id});
        res.render('productdetails' , {product: product});
        console.log(product);
    } catch (e) {
        console.log(e);
    }
    // const product = await Product.findById({_id: id});
    
})





module.exports = router ;
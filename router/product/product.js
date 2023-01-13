const express = require('express');
const router = express.Router();
const Product = require('../../models/product');

router.get('/' , async (req,res) => {
    const product = await Product.find({});
    console.log(product);
    res.render('allproducts' , {productList: product});
})

router.get('/:id' , async (req,res) => {
    const {id} = req.params ;
    const product = await Product.findById({_id: id });
    console.log(product);
    res.render('productdetails' , {product: product});
})





module.exports = router ;
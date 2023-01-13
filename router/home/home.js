const express = require('express');
const router = express.Router();
const Product = require('../../models/product');


router.get('/' , async (req,res) => {
    const product = await Product.find({});
    res.render('home' , {productList : product});
})






module.exports = router ;
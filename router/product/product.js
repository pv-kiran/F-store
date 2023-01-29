const express = require('express');
const router = express.Router();

// const Product = require('../../models/product');
// const Category = require('../../models/category');


const {getAllProducts, getProduct, filteredProducts} = require('../../controllers/productController')

router.get('/' , getAllProducts )

router.get('/category/:id' , filteredProducts);

router.get('/:id' , getProduct );





module.exports = router ;
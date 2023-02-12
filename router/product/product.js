const express = require('express');
const router = express.Router();

// const Product = require('../../models/product');
// const Category = require('../../models/category');


const {getAllProducts, getProduct, filteredProducts , searchedProducts , productPriceFilter} = require('../../controllers/productController');
const Product = require('../../models/product');

router.get('/' , getAllProducts )

router.get('/category/:id' , filteredProducts);

router.get('/:id' , getProduct );


router.post('/search' , searchedProducts )


router.post('/price' , productPriceFilter )


module.exports = router ;
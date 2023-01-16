const express = require('express');
const router = express.Router();


const { getAllUsers, softDelete , searchUser, getProductForm, addProduct, getAllProducts, updateProductStatus, getProduct } = require('../../controllers/adminController');


// Route for admin dashboard : User management
router.get('/users' , getAllUsers)

// Route for admin : Blocking/Unblocking user
router.put('/user/:id' , softDelete)

// Route for admin : Searching for user
router.post('/search' , searchUser)


// To get product form
router.get('/addproduct' , getProductForm );


// to add the product
router.post('/addproduct' , addProduct);


// to view the product
router.get('/getproducts' , getAllProducts);

//updating the status of product
router.put('/productstatus/:id' , updateProductStatus);

// view a specific product
router.get('/product/:id' , getProduct);






router.get('/orders' , (req,res) => {
   res.render('admin/orderboard');
})


module.exports = router;
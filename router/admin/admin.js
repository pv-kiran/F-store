const express = require('express');
const router = express.Router();


const { getAllUsers, softDelete , searchUser, getProductForm, addProduct, getAllProducts, updateProductStatus, getProduct, getCategories, addCategory, updateCategory, getOrders, deliverOrder, updateProduct } = require('../../controllers/adminController');

const {isAdminLoggedIn} = require('../../middlewares/authmiddleware');
const { cancelOrder } = require('../../controllers/orderController');

// Route for admin dashboard : User management
router.get('/users' , isAdminLoggedIn , getAllUsers)

// Route for admin : Blocking/Unblocking user
router.put('/user/:id' , isAdminLoggedIn , softDelete)

// Route for admin : Searching for user
router.post('/search' , isAdminLoggedIn , searchUser)


// To get product form
router.get('/addproduct' , isAdminLoggedIn , getProductForm );


// to add the product
router.post('/addproduct' , isAdminLoggedIn  , addProduct);

// to view the product
router.get('/getproducts' , isAdminLoggedIn , getAllProducts);

//updating the status of product
router.put('/productstatus/:id' , isAdminLoggedIn , updateProductStatus);

// view a specific product
router.get('/product/:id' , isAdminLoggedIn , getProduct);

// to update the product
router.post('/product/:id' ,  isAdminLoggedIn, updateProduct);

// get category list
router.get('/categories' ,isAdminLoggedIn, getCategories);

// add new category
router.post('/addcategory', isAdminLoggedIn , addCategory);


// update / block category
router.put('/categorystatus/:id' , isAdminLoggedIn , updateCategory);

// get all orders
router.get('/orders' ,  isAdminLoggedIn , getOrders);

// cancell order
router.put('/order/cancel/:id' , isAdminLoggedIn , cancelOrder);

// deliver order
router.put('/order/deliver/:id' , isAdminLoggedIn , deliverOrder);

router.get('/logout' , (req,res) => {
    req.session.adminEmail = null;
    req.session.adminId = null;
    res.redirect('/user/signin');
})


module.exports = router;
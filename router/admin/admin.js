const express = require('express');
const router = express.Router();


const Category = require('../../models/category');

const { getAllUsers, softDelete , searchUser, getProductForm, addProduct, getAllProducts, updateProductStatus, getProduct } = require('../../controllers/adminController');

const {isAdminLoggedIn} = require('../../middlewares/authmiddleware');

// Route for admin dashboard : User management
router.get('/users' , isAdminLoggedIn , getAllUsers)

// Route for admin : Blocking/Unblocking user
router.put('/user/:id' , isAdminLoggedIn , softDelete)

// Route for admin : Searching for user
router.post('/search' , isAdminLoggedIn , searchUser)


// To get product form
router.get('/addproduct' , getProductForm );


// to add the product
router.post('/addproduct'  , addProduct);


// to view the product
router.get('/getproducts' , isAdminLoggedIn , getAllProducts);

//updating the status of product
router.put('/productstatus/:id' , isAdminLoggedIn , updateProductStatus);

// view a specific product
router.get('/product/:id' , isAdminLoggedIn , getProduct);


router.get('/categories' , async (req,res) => {
   const categoryList = await Category.find({});
   console.log(categoryList);
   res.render('admin/categoryboard' , {categoryList: categoryList});
})

router.post('/addcategory' , async (req,res) => {
   const {category} = req.body ; 
   try {
      const newCategory = await Category.create({
          categoryName: category ,
          isAvailable: true
      });
      res.redirect('/admin/categories')
   } catch(e) {
      console.log(e);
   }
    
})

router.put('/categorystatus/:id' , async (req,res) => {
   const {id} = req.params ;
    console.log(id);
    try {
        const category = await Category.findById({ _id: id});
        const isAvailable = category.isAvailable ;
        category.isAvailable = !isAvailable;
        await category.save();
        res.json({redirect: '/admin/categories'});
    } catch(e) {
        console.log(e);
    } 
})


router.get('/orders' , (req,res) => {
   res.render('admin/orderboard');
})


module.exports = router;
const express = require('express');
const router = express.Router();


const Category = require('../../models/category');
const Order = require('../../models/order');
const Product = require('../../models/product');


const { getAllUsers, softDelete , searchUser, getProductForm, addProduct, getAllProducts, updateProductStatus, getProduct } = require('../../controllers/adminController');

const {isAdminLoggedIn} = require('../../middlewares/authmiddleware');

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


router.get('/categories' , async (req,res) => {
   try {
      const categoryList = await Category.find({});
      console.log(categoryList);
      res.render('admin/categoryboard' , {categoryList: categoryList});
   } catch(e) {
      console.log(e);
   }
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


router.get('/orders' , async  (req,res) => {
   const orders = await Order.find({}).populate('orderItems.id').populate('user');
   console.log(orders);
   console.log(orders[0].orderItems);
   res.render('admin/orderboard' , {orders: orders});
})


router.put('/order/cancel/:id' , async (req,res) => {
   const id = req.params.id;
    const order = await Order.find({id: id});
    console.log(order[0].orderItems);

    const updateStock = async (productId , quantity) => {
        const product = await Product.find({_id:productId});
        product[0].stock = product[0].stock + quantity ;
        product[0].save({validateBeforeSave: false});
   }

   order[0].orderItems.forEach(async (item) => {
       await updateStock(item.id , item.quantity )
   })

   const cancellOrder = await Order.findOneAndUpdate({_id: id} , {isCancelled: true});
   console.log(cancellOrder);
})


router.put('/order/deliver/:id' , async (req,res) => {
   const id = req.params.id;
    const order = await Order.find({id: id});
    console.log(order[0].orderItems);

    const updateStock = async (productId , quantity) => {
        const product = await Product.find({_id:productId});
        product[0].stock = product[0].stock + quantity ;
        product[0].save({validateBeforeSave: false});
   }

   order[0].orderItems.forEach(async (item) => {
       await updateStock(item.id , item.quantity )
   })

   const deliveredOrder = await Order.findOneAndUpdate({_id: id} , {isDelivered: true});
   console.log(deliveredOrder);
})


module.exports = router;
const express = require('express');
const router = express.Router();


const { getAllUsers, softDelete , searchUser, getProductForm, addProduct, getAllProducts, updateProductStatus, getProduct, getCategories, addCategory, updateCategory, getOrders, deliverOrder, updateProduct } = require('../../controllers/adminController');

const {isAdminLoggedIn} = require('../../middlewares/authmiddleware');
const { cancelOrder } = require('../../controllers/orderController');

const Order = require('../../models/order');
const Product = require('../../models/product');
const User = require('../../models/user');



router.get('/dashboard'  , async (req,res) => {
    // console.log('Hello');

    const user = await User.find({});
    const product = await Product.find({});
    const order = await Order.find({});
    console.log(`${user.length} ${product.length} ${order.length}`);


    res.render('admin/dashboard' , {user: user.length , product: product.length , order: order.length});
})


router.get('/chart' , async (req,res) => {


    // console.log('I am ready to provide the chart');

    // const order = await Order.aggregate([ { $unwind : "$orderItems" } ])

    // console.log(order[0]);

    const productWiseSale = await Order.aggregate(
        [
          {
            '$lookup': {
              'from': 'products', 
              'localField': 'orderItems.id', 
              'foreignField': '_id', 
              'as': 'test'
            }
          }, {
            '$unwind': {
              'path': '$test'
            }
          }, {
            '$group': {
              '_id': '$test.productName', 
              'totalAmount': {
                '$sum': '$totalAmount'
              }
            }
          }
        ]
    )

    console.log(productWiseSale);


    const categoryWiseProducts = await Product.aggregate(
      [
        {
          '$lookup': {
            'from': 'categories', 
            'localField': 'categories', 
            'foreignField': '_id', 
            'as': 'result'
          }
        }, {
          '$unwind': {
            'path': '$result'
          }
        }, {
          '$group': {
            '_id': '$result.categoryName', 
            'total': {
              '$sum': 1
            }
          }
        }
      ]
    )
    console.log(categoryWiseProducts);

    const dailyWiseSale = await Order.aggregate(
      [
        {
          '$project': {
            'totalAmount': 1, 
            'orderItems': {
              '$dateToString': {
                'format': '%Y-%m-%d', 
                'date': '$createdAt'
              }
            }
          }
        },
        {
          '$group': {
            '_id': '$orderItems', 
            'totalAmount': {
              '$sum': '$totalAmount'
            }
          }
        }
      ]
    )

    console.log(dailyWiseSale);


    

    res.json({
        categories: categoryWiseProducts ,
        productWiseSale: productWiseSale ,
        dailyWiseSale: dailyWiseSale
    })
})


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






















// const order = await Order.aggregate([
    //     {
    //       '$lookup': {
    //         'from': 'products', 
    //         'localField': 'orderItems.id', 
    //         'foreignField': '_id', 
    //         'as': 'test'
    //       }
    //     }, {
    //       '$unwind': {
    //         'path': '$test'
    //       }
    //     }, {
    //       '$lookup': {
    //         'from': 'categories', 
    //         'localField': 'test.categories', 
    //         'foreignField': '_id', 
    //         'as': 'result'
    //       }
    //     }
    // ])



    // const data = [
    //   { year: 2010, count: 10 },
    //   { year: 2011, count: 20 },
    //   { year: 2012, count: 15 },
    //   { year: 2013, count: 25 },
    //   { year: 2014, count: 22 },
    //   { year: 2015, count: 30 },
    //   { year: 2016, count: 28 },
    // ];
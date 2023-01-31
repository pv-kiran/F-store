const express = require('express');
const router = express.Router();



const { getAllUsers, softDelete , searchUser, getProductForm, addProduct, getAllProducts, updateProductStatus, getProduct, getCategories, addCategory, updateCategory, getOrders, deliverOrder, updateProduct , getDashBoard , getChartData,dailySalesReportDownload , getDailySalesReportPage , productWiseReportDownload , getProductWiseReportpage , orderTracking } = require('../../controllers/adminController');

const {isAdminLoggedIn} = require('../../middlewares/authmiddleware');
const { cancelOrder } = require('../../controllers/orderController');
const Coupon = require('../../models/coupon');



// route for the main dashboard
router.get('/dashboard' , isAdminLoggedIn  , getDashBoard)

// route for displaying the chart details
router.get('/chart' , isAdminLoggedIn , getChartData)

// route for daily report download
router.get('/dailysales/report'  , dailySalesReportDownload)

// route for daily report cretaion / design
router.get('/dailywise/report'  , getDailySalesReportPage)

// route for downloading product wise sales report
router.get('/prodcutsales/report'  , productWiseReportDownload)

// route for daily report cretaion / design
router.get('/productwise/report' , getProductWiseReportpage)


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

// updating tracking info
router.put('/order/tracking/:id' , isAdminLoggedIn , orderTracking);


// deliver order
router.put('/order/deliver/:id' , isAdminLoggedIn , deliverOrder);


router.get('/coupon' , async (req,res) => {
    try {
        const coupon = await Coupon.find({});
        res.render('admin/couponboard' , {coupon: coupon});
    } catch(e) {
        console.log(e);
    }
    
})

router.post('/addcoupon' , async (req,res) => {
    let {couponCode , expiryDate , minDiscountAmount  , discountPercentage} = req.body ;
    try {
        const coupon = await Coupon.create({
            couponCode: couponCode ,
            expiryDate: new Date(expiryDate) ,
            minDiscountAmount: parseInt(minDiscountAmount) ,
            discountPercentage: parseInt(discountPercentage)
        });
        console.log(coupon);
        await coupon.save();
    } catch(e) {
        console.log(e);
    }
    
})

router.put('/updatecoupon/:id' , async (req,res) => {
    const {id} = req.params ;
    try {
        const coupon = await Coupon.findById({ _id: id});
        const isAvailable = coupon.isAvailable ;
        coupon.isAvailable = !isAvailable;
        await coupon.save();
        res.json({redirect: '/admin/coupon'});
    } catch(e) {
        console.log(e);
    }
})






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
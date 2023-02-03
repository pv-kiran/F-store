const express = require('express');
const router = express.Router();





const { getAllUsers, softDelete , searchUser, getProductForm, addProduct, getAllProducts, updateProductStatus, getProduct, getCategories, addCategory, updateCategory, getOrders, deliverOrder, updateProduct , getDashBoard , getChartData,dailySalesReportDownload , getDailySalesReportPage , productWiseReportDownload , getProductWiseReportpage , orderTracking , getCouponDashboard , addCoupon , updateCoupon , addProductOffer , removeProductOffer , addCategoryOffer , removeCategoryOffer , dialyWiseXlsxReport , productWiseXlsxReport } = require('../../controllers/adminController');

const {isAdminLoggedIn} = require('../../middlewares/authmiddleware');
const { cancelOrder } = require('../../controllers/orderController');




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



// downloading excell sheet - dailywise report
router.get('/dailywise/xslx/report' , isAdminLoggedIn , dialyWiseXlsxReport)

// downloading excell sheet - Product wise report
router.get('/productwise/xslx/report' , productWiseXlsxReport )



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


// to fetch coupon dashboard 
router.get('/coupon' , isAdminLoggedIn ,getCouponDashboard )


// to add coupon
router.post('/addcoupon' , isAdminLoggedIn , addCoupon )

// to block coupon
router.put('/updatecoupon/:id' , isAdminLoggedIn , updateCoupon )


// add product offer
router.post('/offer/:id' , isAdminLoggedIn , addProductOffer)


// remove product offer
router.put('/offer/:id' , isAdminLoggedIn , removeProductOffer );


// add category offer
router.post('/category/offer/:id' , isAdminLoggedIn , addCategoryOffer)


// remove category offer
router.put('/categoryoffer/:id' , isAdminLoggedIn , removeCategoryOffer)


router.get('/logout' , (req,res) => {
    req.session.adminEmail = null;
    req.session.adminId = null;
    res.redirect('/user/signin');
})

module.exports = router;























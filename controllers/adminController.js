const cloudinary = require('cloudinary').v2;
const puppeteer = require('puppeteer');


cloudinary.config({
   cloud_name : "dk81bsiz2" ,
   api_key: "334739518657796" ,
   api_secret: "9OxvjE_0mewIx-NNfeLVKd8U_C0"
});

const User = require('../models/user');
const Product = require('../models/product');
const Category = require('../models/category');
const Order = require('../models/order');
const Coupon = require('../models/coupon');

const getDashBoard = async (req,res) => {
    try {
      const user = await User.find({});
      const product = await Product.find({});
      const order = await Order.find({});
    //   console.log(`${user.length} ${product.length} ${order.length}`);
    
      res.render('admin/dashboard' , {user: user.length , product: product.length , order: order.length});
    } catch(e) {
      console.log(e);
    } 
}

const getChartData = async (req,res) => {


    // console.log('I am ready to provide the chart');

    // const order = await Order.aggregate([ { $unwind : "$orderItems" } ])

    // console.log(order[0]);

    try {

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

        // console.log(productWiseSale);


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
        // console.log(categoryWiseProducts);

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

        // console.log(dailyWiseSale);
        res.json({
          categories: categoryWiseProducts ,
          productWiseSale: productWiseSale ,
          dailyWiseSale: dailyWiseSale
        })

    }  catch(e) {
      console.log(e);
    }
}

const dailySalesReportDownload = async (req,res) => {


    try {
  
          // Create a browser instance
          const browser = await puppeteer.launch();
          // Create a new page
          const page = await browser.newPage();
  
          // this needs to change {Hosting}
          const website_url = 'http://localhost:4000/admin/dailywise/report';
  
          await page.goto(website_url, { waitUntil: 'networkidle0' });
  
          //To reflect CSS used for screens instead of print
          await page.emulateMediaType('screen');
  
          const pdf = await page.pdf({
            path: 'result.pdf',
            margin: { top: '100px', right: '50px', bottom: '100px', left: '50px' },
            printBackground: true,
            format: 'A4',
          });
  
          res.download('result.pdf');
  
          await browser.close();
  
    } catch(e) {
       console.log(e);
    }
      
}

const getDailySalesReportPage = async (req,res) => {

    try {
  
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
        res.render('admin/adminreport' , {dailyWiseSale: dailyWiseSale});
  
    } catch(e) {
        console.log(e);
    }
    
}

const productWiseReportDownload = async (req,res) => {


    try {
  
          // Create a browser instance
          const browser = await puppeteer.launch();
          // Create a new page
          const page = await browser.newPage();
  
          // this needs to change {Hosting}
          const website_url = 'http://localhost:4000/admin/productwise/report';
  
          await page.goto(website_url, { waitUntil: 'networkidle0' });
  
          //To reflect CSS used for screens instead of print
          await page.emulateMediaType('screen');
  
          const pdf = await page.pdf({
            path: 'productresult.pdf',
            margin: { top: '100px', right: '50px', bottom: '100px', left: '50px' },
            printBackground: true,
            format: 'A4',
          });
  
          res.download('productresult.pdf');
  
          await browser.close();
  
    } catch(e) {
       console.log(e);
    }
      
}

const getProductWiseReportpage = async (req,res) => {

    try {
  
         const productWiseSale = await Order.aggregate(
        [
          {
            '$lookup': {
              'from': 'products', 
              'localField': 'orderItems.id', 
              'foreignField': '_id', 
              'as': 'test'
            }
          },
          {
            '$unwind': {
              'path': '$test'
            }
          }, 
          {
            '$group': {
              '_id': '$test.productName', 
              'totalAmount': {
                '$sum': '$totalAmount'
              }
            }
          } ,
          {
            '$sort': {
                'totalAmount': -1
            }
          }
        ]
         )
  
        //  console.log(productWiseSale);
        
         res.render('admin/productwisereport' , {productWiseSale: productWiseSale});
  
    } catch(e) {
        console.log(e);
    }
}

const getAllUsers = async (req,res) => {
    try {
       const user = await User.find({});
       res.render('admin/userboard' , {userList: user});
    } catch(e) {
       console.log(e);
    }
}

const softDelete = async (req,res) => {
    const {id} = req.params ;
    try {
        const user = await User.findById({ _id: id});
        const isBlocked = user.isBlocked ;
        user.isBlocked = !isBlocked;
        await user.save();
        res.json({redirect: '/admin/users'});
    } catch(e) {
        console.log(e);
    }
}

const searchUser = async (req,res) => {
    const {name} = req.body ;
    const queryObject = {};
     if(name) {
         queryObject.name = {$regex: name , $options: 'i'};
     }
     const user = await User.find(queryObject)
     res.render('admin/userboard' , {userList: user});
}

const getProductForm = async  (req,res) => {
    const categories = await Category.find({isAvailable: true});
    console.log(categories);
    res.render('admin/addproduct' , {categoryList: categories});
};

const addProduct = async (req,res) => {
    console.log("hello");
    console.log(req.files);
    const { productName , price , description , categories, material , productDimension ,manufacturedBy , marketedBy , stock , countryOfOrigin } = req.body ;
   //  console.log(req.files);
    const imgArr = [];
    try {
         const product = await Product.find({productName: productName});

         if(product.length >= 1) {
            const isExisting = true;
            const errMessage = 'Product already added .. Please go with another product';
            res.render('admin/addproduct' , {isExisting: isExisting , errMessage: errMessage});
   
         } else {
   
            if(req.files) {
               console.log(req.files);
   
               // uploading the product images to the cloudinary
               for (let index = 0; index < req.files.imagefile.length; index++) {
      
                  result = await cloudinary.uploader.upload(req.files.imagefile[index].tempFilePath , {
                        folder: 'furnitures'
                  });
                  imgArr.push({
                        id: result.public_id ,
                        secured_url: result.secure_url
                  });
      
               }
   
               console.log(imgArr);
            }
      
            const newProduct = await Product.create({
               productName: productName ,
               price: parseInt(price) ,
               description: description ,
               categories: categories ,
               material: material ,
               productDimension: productDimension ,
               manufacturedBy: manufacturedBy ,
               marketedBy: marketedBy ,
               stock: parseInt(stock) ,
               countryOfOrigin: countryOfOrigin ,
               images: imgArr
            })
   
            res.redirect('/admin/getproducts');
            
         }
    } catch(e) {
      console.log(e);
    }
}

const getAllProducts = async (req,res) => {
    try {
       const products = await Product.find({});
    //    console.log(products[0].isBlocked);
 
       res.render('admin/productboard', {products: products});
    } catch(e) {
       console.log(e);
    }
} ;

const updateProductStatus = async (req,res) => {
    const {id} = req.params ;
    console.log(id);
    try {
        const product = await Product.findById({ _id: id});
        const isBlocked = product.isBlocked ;
        product.isBlocked = !isBlocked;
        await product.save();
        res.json({redirect: '/admin/getproducts'});
    } catch(e) {
        console.log(e);
    } 
 }

const getProduct = async (req,res) => {
    const {id} = req.params ;
    try {
        const category = await Category.find({isAvailable:true});
        const product = await Product.find({_id:id});
        res.render('admin/updateproduct' , 
                   {product : product[0] , category: category});
    } catch(e) {
        console.log(e);
    }
   
}

const updateProduct = async (req, res) => {
    const {id} = req.params;
    req.body.price = parseInt(req.body.price);
    req.body.stock = parseInt(req.body.stock);
    // console.log(req.body);
    // console.log(id);

    try {
        let product = await Product.find({_id: id});
        let imgArr = [] ;
        let result;
        if(req.files) {
            // destroy the existing images
            for (let index = 0; index < product[0].images.length; index++) {
            const res = await cloudinary.uploader.destroy(product[0].images[index].id);
            }

            // upload and save the images
            for (let index = 0; index < req.files.imagefile.length; index++) {
        
                result = await cloudinary.uploader.upload(req.files.imagefile[index].tempFilePath , {
                    folder: 'furnitures'
                });
                imgArr.push({
                    id: result.public_id ,
                    secured_url: result.secure_url
                });

            }
            req.body.images = imgArr ;
        }
        product = await Product.findByIdAndUpdate(id , req.body , {
            new: true ,
            runValidators: true
        }) ;

        res.redirect('/admin/getproducts');

    } catch(e) {
       console.log(e);
    }
    
}

const getCategories = async (req,res) => {
    try {
       const categoryList = await Category.find({});
       console.log(categoryList);
       res.render('admin/categoryboard' , {categoryList: categoryList});
    } catch(e) {
       console.log(e);
    }
}

const addCategory = async (req,res) => {
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
 
}

const updateCategory = async (req,res) => {
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
}

const getOrders = async  (req,res) => {
    try {
        const orders = await Order.find({}).populate('orderItems.id').populate('user');
        res.render('admin/orderboard' , {orders: orders});
    } catch(e) {
        console.log(e);
    }
    
}

const orderTracking = async (req,res) => {
  const trackingIfo = req.body.tracking_info;
  const {id} = req.params ;
  console.log(id);
  try {
      const order = await Order.find({_id:id});
      // console.log(order[0]);
      order[0].trackingInfo = trackingIfo;
      await order[0].save();
      res.json({redirect: '/admin/orders'});
  } catch(e) {
      console.log(e);
  }
  
}

const cancelOrders = async (req,res) => {
    const id = req.params.id;
    try {
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
        res.json({redirect: '/admin/orders'});
    } catch(e) {
        console.log(e);
    }
     
}

const deliverOrder = async (req,res) => {
     const id = req.params.id;
     try {
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
       res.json({redirect: '/admin/orders'});
     } catch(e) {
        console.log(e);
     }
    
}

const getCouponDashboard = async (req,res) => {
  try {
      const coupon = await Coupon.find({});
      res.render('admin/couponboard' , {coupon: coupon});
  } catch(e) {
      console.log(e);
  }
  
}


const addCoupon = async (req,res) => {
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
      res.redirect('/admin/coupon');
  } catch(e) {
      console.log(e);
  }
  
}

const updateCoupon = async (req,res) => {
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
}

module.exports = {
    getDashBoard,
    getAllUsers ,
    softDelete ,
    searchUser , 
    getProductForm ,
    addProduct ,
    getAllProducts ,
    updateProductStatus ,
    getProduct ,
    getCategories ,
    addCategory ,
    updateCategory ,
    getOrders ,
    cancelOrders ,
    deliverOrder ,
    orderTracking ,
    updateProduct ,
    getChartData ,
    dailySalesReportDownload ,
    getDailySalesReportPage,
    productWiseReportDownload ,
    getProductWiseReportpage , 
    getCouponDashboard ,
    addCoupon ,
    updateCoupon
};
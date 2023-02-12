const puppeteer = require('puppeteer');
const XLSX = require('xlsx');

const Razorpay = require('razorpay');

const cloudinary = require('cloudinary').v2;
cloudinary.config({
   cloud_name : process.env.CLOUD_NAME ,
   api_key: process.env.CLOUDINARY_KEY ,
   api_secret: process.env.CLOUDINARY_SECRET
});

const User = require('../models/user');
const Product = require('../models/product');
const Category = require('../models/category');
const Order = require('../models/order');
const Coupon = require('../models/coupon');
const Banner = require('../models/banner');

const getDashBoard = async (req,res) => {
    try {
      const user = await User.find({});
      const product = await Product.find({});
      const order = await Order.find({isCancelled: false});
    
      res.render('admin/dashboard' , {user: user.length , product: product.length , order: order.length});
    } catch(e) {
      console.log(e);
    } 
}

const getChartData = async (req,res) => {

    try {

        const productWiseSale = await Order.aggregate(
            [
              {
                '$match': {
                  'isCancelled': false
                }
              } ,
              {
                '$sort': {
                  'createdAt': -1
                }
              } ,
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
          // const website_url = 'http://localhost:4000/admin/dailywise/report';
          
          const website_url = `${req.protocol}://${req.get("host")}/admin/dailywise/report`;

  
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


//  ----------------------- for linux system  -------------------- //
// const dailySalesReportDownload = async (req,res) => {


//   try {
//         /*  const firefoxOptions = {
//         executablePath:'/usr/bin/firefox',
//         headless:false,
//         product: 'firefox',
//         extraPrefsFirefox: {
//           // Enable additional Firefox logging from its protocol implementation
//           // 'remote.log.level': 'Trace',
//         },
//         // Make browser logs visible
//         dumpio: true,
//         }; */
//                 // Create a browser instance
//         const browser =  await puppeteer.launch(
//                             //firefoxOptions
//                             {executablePath: '/usr/bin/chromium-browser'}
//                          );

//         // Create a new page
//         const page = await browser.newPage();

//         // this needs to change {Hosting}
//         // const website_url = 'http://localhost:4000/admin/dailywise/report';

//         const website_url = `${req.protocol}://${req.get("host")}/admin/dailywise/report`;


//         await page.goto(website_url, { waitUntil: 'networkidle0' });

//         //To reflect CSS used for screens instead of print
//         await page.emulateMediaType('screen');

//         const pdf = await page.pdf({
//           path: 'result.pdf',
//           margin: { top: '100px', right: '50px', bottom: '100px', left: '50px' },
//           printBackground: true,
//           format: 'A4',
//         });

//         res.download('result.pdf');

//         await browser.close();

//   } catch(e) {
//      console.log(e);
//   }

// }


const getDailySalesReportPage = async (req,res) => {

    try {
  
        const dailyWiseSale = await Order.aggregate(
          [
            {
              '$match': {
                'isCancelled': false
              }
            } ,
            {
              '$sort': {
                'createdAt': -1
              }
            } ,
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
          // const website_url = 'http://localhost:4000/admin/productwise/report';
          const website_url = `${req.protocol}://${req.get("host")}/admin/productwise/report`;

  
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

//  ------------------  FOR LINUX SYSTEM  --------------------  //
// const productWiseReportDownload = async (req,res) => {


//   try {
//         /*const firefoxOptions = {
//         executablePath:'/usr/bin/firefox',
//         headless:false,
//         product: 'firefox',
//         extraPrefsFirefox: {
//           // Enable additional Firefox logging from its protocol implementation
//           // 'remote.log.level': 'Trace',
//         },
//         // Make browser logs visible
//         dumpio: true,
//         };*/

//         // Create a browser instance
//         const browser = await puppeteer.launch(
//                           //firefoxOptions
//                           {executablePath: '/usr/bin/chromium-browser'}
//                         );

//         // Create a new page
//         const page = await browser.newPage();

//         // this needs to change {Hosting}
//         // const website_url = 'http://localhost:4000/admin/productwise/report';
//         const website_url = `${req.protocol}://${req.get("host")}/admin/productwise/report`;


//         await page.goto(website_url, { waitUntil: 'networkidle0' });

//         //To reflect CSS used for screens instead of print
//         await page.emulateMediaType('screen');

//         const pdf = await page.pdf({
//           path: 'productresult.pdf',
//           margin: { top: '100px', right: '50px', bottom: '100px', left: '50px' },
//           printBackground: true,
//           format: 'A4',
//         });

//         res.download('productresult.pdf');

//         await browser.close();

//   } catch(e) {
//      console.log(e);
//   }

// }


const getProductWiseReportpage = async (req,res) => {

    try {
  
         const productWiseSale = await Order.aggregate(
            [
              {
                '$match': {
                  'isCancelled': false
                }
              } ,
              {
                '$sort': {
                  'createdAt': -1
                }
              } ,
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

const dialyWiseXlsxReport = async (req,res) => {
  try {

      const dailyWiseSale = await Order.aggregate(
        [
          {
            '$match': {
              'isCancelled': false
            }
          } ,
          {
            '$sort': {
              'createdAt': -1
            }
          } ,
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
      ) ;

      const workSheet = XLSX.utils.json_to_sheet(dailyWiseSale);
      const workBook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workBook, workSheet, 'Daily wise sheet');
      XLSX.writeFile(workBook, 'sampledaily.xlsx');

      res.download('sampledaily.xlsx')

  } catch(e) {
      console.log(e);
  }
}

const productWiseXlsxReport = async (req,res) => {
  try {

      const productWiseSale = await Order.aggregate(
          [
            {
              '$match': {
                'isCancelled': false
              }
            } ,
            {
              '$sort': {
                'createdAt': -1
              }
            } ,
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

      const workSheet = XLSX.utils.json_to_sheet(productWiseSale);
      const workBook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workBook, workSheet, 'Product wise sheet');
      XLSX.writeFile(workBook, 'sampleproduct.xlsx');

      res.download('sampleproduct.xlsx')

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
    res.render('admin/addproduct' , {categoryList: categories});
};

const addProduct = async (req,res) => {
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
              //  console.log(req.files);
   
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
   
              //  console.log(imgArr);
            }
      
            const newProduct = await Product.create({
               productName: productName ,
               price: parseInt(price) ,
               actualPrice:parseInt(price) ,
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
    // console.log(id);
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
        let categories = await Category.find({isAvailable:true});
        const product = await Product.find({_id:id}).populate('categories');

        const productCategory = product[0].categories.categoryName;
        const productCategoryId = product[0].categories._id;

        // console.log(categories);
        categories = categories.filter((item) => {
          if(item.categoryName != productCategory) {
            return item ;
          }
        })

        res.render('admin/updateproduct' , 
                   {product : product[0] , category: categories , productCategory: productCategory , productCategoryId: productCategoryId});
    } catch(e) {
        console.log(e);
    }
   
}

const updateProduct = async (req, res) => {
    const {id} = req.params;
    req.body.price = parseInt(req.body.price);
    req.body.stock = parseInt(req.body.stock);
    req.body.actualPrice = parseInt(req.body.price);
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
      //  console.log(categoryList);
       res.render('admin/categoryboard' , {categoryList: categoryList});
    } catch(e) {
       console.log(e);
    }
}

const addCategory = async (req,res) => {
    const {category} = req.body ; 
    try {
       const categories  = await Category.find({categoryName: category});
       if(categories.length > 0) {
        
          res.redirect('/admin/categories');

       } else {

          const newCategory = await Category.create({
            categoryName: category ,
            isAvailable: true
          });

          res.redirect('/admin/categories')


       }

       
    } catch(e) {
       console.log(e);
    }
}

const updateCategory = async (req,res) => {
    const {id} = req.params ;
    //  console.log(id);
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
        const orders = await Order.find({}).populate('orderItems.id').populate('user').sort({'createdAt': -1});
        res.render('admin/orderboard' , {orders: orders});
    } catch(e) {
        console.log(e);
    }
    
}

const orderTracking = async (req,res) => {
  const trackingIfo = req.body.tracking_info;
  const {id} = req.params ;
  // console.log(id);
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
        // console.log(order[0].orderItems);
    
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
        // console.log(order[0].orderItems);
    
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
      // console.log(coupon);
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

const addProductOffer = async (req,res) => {
  const {id} = req.params ;
  const {offer} = req.body ;
  try {
     const product = await Product.find({_id: id});
     product[0].offer = parseInt(offer) ;
     product[0].isOfferAvailable = true;
     product[0].price = product[0].actualPrice - ( product[0].actualPrice * parseInt(offer) ) / 100 ;
     await product[0].save();
     res.redirect('/admin/getproducts')
  } catch(e) {
     console.log(e);
  }
}

const removeProductOffer = async (req,res) => {
  const {id} = req.params ;
  try {
     const product = await Product.find({_id: id});
     product[0].offer = 0;
     product[0].isOfferAvailable = false;
     product[0].price = product[0].actualPrice;
     await product[0].save();
     res.json({redirect:'/admin/getproducts'})
  } catch(e) {
     console.log(e);
  }
}

const addCategoryOffer = async (req,res) => {
  const {id} = req.params ;
  const {offer} = req.body ;

  // console.log('This is post');

  try {

      const category = await Category.find({_id:id});
      category[0].offer = parseInt(offer);
      category[0].isOfferAvailable = true;


      const products = await Product.find({categories: id});
      
      products.forEach(async (product) => {
          product.offer = parseInt(offer) ;
          product.isOfferAvailable = true;
          product.price = product.actualPrice - ( product.actualPrice * parseInt(offer) ) / 100 ;
          await product.save();
      })


      await category[0].save();

      res.redirect('/admin/categories');

  }  catch(e) {
      console.log(e);
  } 
}

const removeCategoryOffer = async (req,res) => {

  // console.log('Heloo');
  const {id} = req.params ;
  // console.log(id);
  try {
      const category = await Category.find({_id:id});
      // console.log(category);
      category[0].offer = 0;
      category[0].isOfferAvailable = false;
      const products = await Product.find({categories: id});
      // console.log(products);
      products.forEach(async (product) => {
          product.offer = 0 ;
          product.isOfferAvailable = false;
          product.price = product.actualPrice;
          await product.save();
      })

      // console.log(products);

      await category[0].save();

      res.json({redirect: '/admin/categories'});
  }  catch(e) {
      console.log(e);
  }
} 

const refundDashboard =  async (req,res) => {
  try {
      const orders = await Order.find({isReturn: true}).populate('orderItems.id').populate('user').sort({'createdAt': -1});
      // console.log(orders)
      res.render('admin/refund' , {orders: orders});
  } catch(e) {
      console.log(e);
  }
}

const refundInitiation = async (req,res) => {

  const {id} = req.params ;
  try {
      const order = await Order.find({_id: id});

      let instance = new Razorpay({ key_id: process.env.RAZOR_KEY , key_secret: process.env.RAZOR_SECRET })

      instance.payments.refund(order[0].paymentId , {
          amount: order[0].totalAmount * 100,
          speed: "normal",
      })

      order[0].refundStatus = true;
      await order[0].save();
      res.json({redirect: '/admin/refund'});

  } catch(e) {
      console.log(e);
  }

}

const getBannerDashboard = async (req,res) => {
  try {
      const banner = await Banner.find({});
      if(banner.length > 0) {
          res.render('admin/bannerBoard' , {banner: banner});
      } else {
          // console.log(banner)
          res.render('admin/bannerBoard');
      }

  } catch(e) {
      console.log(e);
  }
 
}

const addBanner = async (req,res) => {
    
  let file = req.files.banner ;
  try {
      const result = await cloudinary.uploader.upload(file.tempFilePath , {
          folder: 'banners'
      })
      const newBanner = await Banner.create({
          id:result.public_id  ,
          secured_url: result.secure_url
      })
      await newBanner.save();
      res.redirect('/admin/banner')
  } catch(e) {
      console.log(e);
  }
}

const activateBanner = async (req,res) => {
  const {id} = req.params;
  try {
      const banner = await Banner.find({_id: id});
      banner[0].isActive = !banner[0].isActive ;
      await banner[0].save({validateBeforeSave : false});
      res.json({redirect: '/admin/banner'});
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
    dialyWiseXlsxReport,
    productWiseXlsxReport,
    getCouponDashboard ,
    addCoupon ,
    updateCoupon ,
    addProductOffer ,
    removeProductOffer ,
    addCategoryOffer ,
    removeCategoryOffer ,
    refundDashboard ,
    refundInitiation ,
    addBanner ,
    getBannerDashboard ,
    activateBanner
};
const express = require('express');
const router = express.Router();




const cloudinary = require('cloudinary').v2;

cloudinary.config({
   cloud_name : "dk81bsiz2" ,
   api_key: "334739518657796" ,
   api_secret: "9OxvjE_0mewIx-NNfeLVKd8U_C0"
});


//  models
const User = require('../../models/user');
const Product = require('../../models/product');

// Route for admin dashboard : User management
router.get('/users' , async (req,res) => {
   const user = await User.find({});
   console.log('Hello');
   console.log(user);
   res.render('admin/userboard' , {userList: user});
})

// Route for admin : Blocking/Unblocking user
router.put('/user/:id' , async (req,res) => {
   const {id} = req.params ;
   console.log(id);
   const user = await User.findById({ _id: id});
   const isBlocked = user.isBlocked ;
   user.isBlocked = !isBlocked;
   await user.save();
   console.log(user);
   res.json({redirect: '/admin/users'});
})

// Route for admin : Searching for user
router.post('/search' , async (req,res) => {
   const {name} = req.body ;
   const queryObject = {};
    if(name) {
        queryObject.name = {$regex: name , $options: 'i'};
    }
    const user = await User.find(queryObject)
    res.render('admin/userboard' , {userList: user});
})



// To get product form
router.get('/addproduct' , (req,res) => {
   res.render('admin/addproduct');
})


// to add the product
router.post('/addproduct' , async (req,res) => {
    
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
   
            console.log(newProduct);
            
         }
    } catch(e) {
      console.log(e);
    }
    
    
})


// to view the product
router.get('/getproducts' , async (req,res) => {
   try {
      const products = await Product.find({});
      console.log(products[0].isBlocked);

      res.render('admin/productboard', {products: products});
   } catch(e) {
      console.log(e);
   }

})

router.put('/productstatus/:id' , async (req,res) => {
   const {id} = req.params ;
   console.log(id);
   const product = await Product.findById({ _id: id});
   const isBlocked = product.isBlocked ;
   product.isBlocked = !isBlocked;
   await product.save();
   console.log(product);
   res.json({redirect: '/admin/getproducts'});
})







router.get('/orders' , (req,res) => {
   res.render('admin/orderboard');
})


module.exports = router;
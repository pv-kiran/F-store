const cloudinary = require('cloudinary').v2;

cloudinary.config({
   cloud_name : "dk81bsiz2" ,
   api_key: "334739518657796" ,
   api_secret: "9OxvjE_0mewIx-NNfeLVKd8U_C0"
});

const User = require('../models/user');
const Product = require('../models/product');
const Category = require('../models/category');



const getAllUsers = async (req,res) => {
    try {
       const user = await User.find({});
       console.log(user);
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
       console.log(products[0].isBlocked);
 
       res.render('admin/productboard', {products: products});
    } catch(e) {
       console.log(e);
    }
} ;

const updateProductStatus = async (req,res) => {
    const {id} = req.params ;
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

module.exports = {
    getAllUsers ,
    softDelete ,
    searchUser , 
    getProductForm ,
    addProduct ,
    getAllProducts ,
    updateProductStatus ,
    getProduct
};
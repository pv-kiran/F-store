const cloudinary = require('cloudinary').v2;

cloudinary.config({
   cloud_name : "dk81bsiz2" ,
   api_key: "334739518657796" ,
   api_secret: "9OxvjE_0mewIx-NNfeLVKd8U_C0"
});

const User = require('../models/user');
const Product = require('../models/product');
const Category = require('../models/category');
const Order = require('../models/order');



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
       console.log(products[0].isBlocked);
 
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
        console.log(orders);
        console.log(orders[0].orderItems);
        res.render('admin/orderboard' , {orders: orders});
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


module.exports = {
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
    updateProduct
};
const Product = require('../models/product');
const Category = require('../models/category');


const getAllProducts = async (req,res) => {
    let isLoggedIn;
    if(req.session.userid) {
      isLoggedIn = true
    } else {
        isLoggedIn = false
    }
    try {
        // const product = await Product.find({isBlocked: false , stock: {$gt: 0}}).populate('categories');
        // console.log(product);
        let product = await Product.find({isBlocked: false , stock: {$gt: 0}}).populate('categories');
        // console.log(product);
        const categories = await Category.find({isAvailable: true});
        // console.log(categories);
        product = product.filter((item) => {
            if(item.categories.isAvailable === true) {
                return item;
            }
        })
        // console.log(product);
        res.render('allproducts' , {productList: product , categories: categories, id: req.session._userId , isLoggedIn: isLoggedIn});
    } catch(e) {
        console.log(e);
    }
};

const getProduct = async (req,res) => {
    const {id} = req.params ;
    let isLoggedIn;
    if(req.session.userid) {
      isLoggedIn = true
    } else {
        isLoggedIn = false
    }
    try {
        const product = await Product.findById({_id: id});
        res.render('productdetails' , {product: product , isLoggedIn: isLoggedIn});
    } catch (e) {
        console.log(e);
    }
}

const filteredProducts = async (req,res) => {

    const {id} = req.params ;

    let isLoggedIn;
    if(req.session.userid) {
      isLoggedIn = true
    } else {
        isLoggedIn = false
    }

    // console.log(id);

    try {


        let productList = await Product.find({isBlocked: false , stock: {$gt: 0}}).populate('categories');

        productList = productList.filter((item) => {
            if(item.categories.categoryName === id ) {
                return item
            }
        })



        const categories = await Category.find({isAvailable: true});

        res.render('allproducts' , {productList: productList , categories: categories, id: req.session._userId , isLoggedIn: isLoggedIn});

    }  catch(e) {
        console.log(e);
    }


}

module.exports = {
    getAllProducts ,
    getProduct ,
    filteredProducts
};
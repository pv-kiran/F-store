const Product = require('../models/product');

const getAllProducts = async (req,res) => {
    let isLoggedIn;
    if(req.session.userid) {
      isLoggedIn = true
    } else {
        isLoggedIn = false
    }
    try {
        const product = await Product.find({isBlocked: false});
        res.render('allproducts' , {productList: product , id: req.session._userId , isLoggedIn: isLoggedIn});
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

module.exports = {
    getAllProducts ,
    getProduct
};
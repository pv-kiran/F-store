const Product = require('../models/product');

const getAllProducts = async (req,res) => {
    try {
        const product = await Product.find({isBlocked: false});
        console.log(product);
        res.render('allproducts' , {productList: product , id: req.session._userId});
    } catch(e) {
        console.log(e);
    }
};

const getProduct = async (req,res) => {
    const {id} = req.params ;
    try {
        const product = await Product.findById({_id: id});
        res.render('productdetails' , {product: product});
    } catch (e) {
        console.log(e);
    }
}

module.exports = {
    getAllProducts ,
    getProduct
};
const express = require('express');
const router = express.Router();
const Product = require('../../models/product');
const Banner = require('../../models/banner');


router.get('/' , async (req,res) => {
    console.log(req.hostname);
    let isLoggedIn;
    if(req.session.userid) {
      isLoggedIn = true;
    } else {
        isLoggedIn = false;
    }
    try {
        // const product = await Product.find({ isBlocked: false , stock: {$gt: 0}}).limit(4);


        const productList = await Product.find({ isBlocked: false , stock: {$gt: 0}}).populate('categories');

        const banner = await Banner.find({isActive: true});
        console.log(productList);

        const product = productList.slice(0,4);
        

        let sofaList = productList.filter((item) => {
            if(item.categories.categoryName === 'Sofa') {
                return item;
            }
        })

        sofaList = sofaList.slice(0,4)

        let tableList = productList.filter((item) => {
            if(item.categories.categoryName === 'Table') {
                return item;
            }
        })

        tableList = tableList.slice(0,4);

        console.log(tableList);


        res.render('home' , {productList : product  , sofaList: sofaList, tableList: tableList , id: req.session._userId , isLoggedIn: isLoggedIn , banner: banner[0]});
    } catch (e) {
        console.log(e);
    }
    
})






module.exports = router ;
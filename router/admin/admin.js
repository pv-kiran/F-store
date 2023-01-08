const express = require('express');
const router = express.Router();


const User = require('../../models/user')

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


router.get('/products' , (req,res) => {
   res.render('admin/productboard');
})

router.get('/orders' , (req,res) => {
   res.render('admin/orderboard');
})


module.exports = router;
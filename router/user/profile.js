const express = require('express');
const router = express.Router();

const bcrypt = require('bcryptjs');


const User = require('../../models/user');


const { getUserProfile, addAdressController, getAddressController, removeAddressController, updateAddressController , updateUserController ,getChangePasswordForm , changeUserPassword} = require('../../controllers/profileController');

const {isLoggedIn} = require('../../middlewares/authmiddleware');


// to fetch the user details
router.get('/:id' , getUserProfile);


// add a new address
router.post('/address/:id' , isLoggedIn , addAdressController);

// get user address
router.get('/address/:id' , isLoggedIn , getAddressController);

// update user address
router.put('/address/:id' , isLoggedIn , updateAddressController);


// delete the user address
router.delete('/address/:id' , isLoggedIn , removeAddressController);

// update the user name
router.put('/username/:id' , isLoggedIn , updateUserController)


// get the change password from
router.get('/user/password' , isLoggedIn , getChangePasswordForm);

//  update the user password
router.put('/user/password' , isLoggedIn , changeUserPassword );


module.exports = router;
const express = require('express');
const router = express.Router();

const {  signUpController, registerController, signInController, verifyController, loginController,   newOtpController, getResetController, postResetController, getResetTokenController, postResetTokenController, logoutController} = require('../../controllers/authController');


// router.use((req, res, next) => {
//     res.set('cache-control', 'no-cache,private,no-store,must-revalidate,max-stale=0,post-check=0,pre-check=0')
//     next();
// });

// home route for user


router.get('/signup' , signUpController);

router.post('/register' , registerController);

router.get('/signin' , signInController);

router.post('/verify' , verifyController);

router.post('/login' , loginController);

router.get('/logout', logoutController);

router.put('/newotp' , newOtpController);

router.get('/resetpswd' , getResetController);

router.post('/resetpswd' , postResetController);

router.get('/reset/:token' , getResetTokenController);

router.post('/reset/:token' , postResetTokenController);



router.get('/:id' , async (req,res) => {
    console.log(req.params.id);
    res.send('Hello');
})





module.exports = router;
const express = require('express');
const router = express.Router();
const User = require('../../models/user');


router.use((req, res, next) => {
    res.set('cache-control', 'no-cache,private,no-store,must-revalidate,max-stale=0,post-check=0,pre-check=0')
    next();
});


const bcrypt = require('bcryptjs');


// nodemailer setup --- latest comment
const nodemailer = require('nodemailer');
const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
      user: 'mail4kpv@gmail.com',
      pass: 'xcueeldvqoceyrua'
    } ,
    tls: {
        ciphers:'SSLv3'
    }
});


// home route for user
router.get('/' , async (req,res) => {
    session=req.session;
    console.log(session);
    if(session.userid){
        const user = await User.find({email: session.userid});
        let isAdmin = false;
        if(user[0].role === 'admin') {
            isAdmin = true ;
        }
        res.render('home' , {email: session.userid, isAdmin: isAdmin });
    } else {
        res.redirect('/user/signin');
    }
  })

router.get('/signup' , (req,res) => {
    session=req.session;
    console.log(session);
    if(session.userid){
        res.redirect('/user');
    } else {
        res.render('signup');
    }
})

router.post('/register' , async (req,res) => {
    const {name , email ,password} = req.body ;
    console.log(email);
    const user = await User.find({email: email});
    console.log(user);
    if(user.length >= 1){
        const isRegitered = true ;
        const errMessage = 'Email is already in use , please register with another email'
        return res.render('signup' , {name , email, isRegitered, errMessage});
    }

    const encPassword = await bcrypt.hash(password , 10);
    // console.log(encPassword);

    const otp = 1000 + Math.floor(Math.random() * 9000);

    const newUser = await User.create({
        name: name ,
        email: email ,
        password: encPassword ,
        otp: otp
    });


    // OTP Send
    const mailOptions = {
        from: 'admin@gmail.com',
        to: `${email}`,
        subject: 'OTP VERIFICATION',
        html: `<p>Enter <b> ${otp} </b> in the app to verify your email address and complete the signup process</p>
        <p>This code expires in 1 hour</p>`
     };

     await transporter.sendMail(mailOptions);



    console.log(newUser);

    res.render('verifyotp',{email: newUser.email});
    // res.redirect('/user/signin');
})


router.get('/signin' , (req,res) => {
    session=req.session;
    console.log(session);
    if(session.userid){
        res.redirect('/user');
    } else {
        res.render('signin');
    }
})

router.post('/verify' , async (req,res) => {

    const {email , otp} = req.body ;
    console.log(otp);
    console.log(email);
    const user = await User.find({email:email});
    // console.log(user);
    if(parseInt(otp) === user[0].otp) {
       const updateUser = await User.findOneAndUpdate({email:email} , { $set : {isVerified: true}});
       user[0].otp = undefined;
       await user[0].save();
       res.redirect('/user/signin');
    } else {
        const isVerified = true ;
        const errorMessage = 'OTP is invalid'
        res.render('verifyotp' , {email: email , isVerified: isVerified , errMessage:errorMessage});
    }

})

router.post('/login' , async (req,res) => {
    const {email , password} = req.body ;
    const user = await User.find({email: email});
    console.log(user);
    if(user.length === 1) {
        const isValidPassword = await bcrypt.compare(password , user[0].password);
        console.log(isValidPassword);
        if(isValidPassword) {
            if(user[0].isVerified) {
                if(!user[0].isBlocked) {
                    session = req.session;
                    session.userid = req.body.email;
                    console.log(req.session);
                    res.redirect('/user');
                } else {
                    const isLogin = true ;
                    const errMessage = 'User is blocked by admin';
                    res.render('signin' , {isLogin: isLogin , errMessage: errMessage , email: email , password:password });
                }
                
            } else {
                const isVerified = true;
                const errorMessage = `please verify your email with OTP. If you haven't recieved an otp please click resend otp button`
                res.render('verifyotp' , {isVerified: isVerified , errMessage: errorMessage , email: email} );
            }
        } else {
             const isLogin = true ;
             const errMessage = 'Invalid password';
             res.render('signin' , {isLogin: isLogin , errMessage: errMessage , email: email , password:password });
        }
    } else {
        const isLogin = true ;
        const errMessage = 'Invalid Email'
        res.render('signin' , {isLogin: isLogin , errMessage: errMessage , email: email , password:password });
    }
})

router.put('/newotp' , async (req,res) => {
    const {email} = req.body ;
    console.log(email);
    const user = await User.find({email: email});

    const otp = 1000 + Math.floor(Math.random() * 9000);

    user[0].otp = otp;
    try {
        // update user
        await user[0].save();
        // OTP Send
        const mailOptions = {
            from: 'admin@gmail.com',
            to: `${email}`,
            subject: 'OTP VERIFICATION',
            html: `<p>Enter <b> ${otp} </b> in the app to verify your email address and complete the signup process This code expires in 1 hour</p>`
            
         };
         await transporter.sendMail(mailOptions);
    } catch(e) {
      console.log(e);
    }
    res.render('verifyotp',{email: email});
})

router.get('/resetpswd' , (req,res) => {
    res.render('resetpswd');
})
router.post('/resetpswd' , async (req,res) => {
    const {email} = req.body ;
    const user = await User.find({email: email});
    if(user.length === 1) {
        let random = (Math.random() + 1).toString(36).substring(3);
        user[0].forgetPasswordToken = random;
        await user[0].save();
        const link = `${req.protocol}://${req.get("host")}/user/reset/${random}`;
        console.log(link);
        const mailOptions = {
            from: 'admin@gmail.com',
            to: `${email}`,
            subject: 'OTP VERIFICATION',
            html: `<a href=${link}>Please Click here</a>`
         };
    
         await transporter.sendMail(mailOptions);
         const isUserExist = true;
         const errMessage = `Link is delivered to your email to chnage the password`;
         res.render('resetpswd' , {isUserExist: isUserExist , errMessage: errMessage });

    } else {
       const isUserExist = true;
       const errMessage = `User doesn't exist, Please check your email.`;
       res.render('resetpswd' , {isUserExist: isUserExist , errMessage: errMessage ,email: email});
    }
    console.log(user);
})

router.get('/reset/:token' , async (req,res) => {
    // console.log(req.params.token);
    const {token} = req.params;
    const user = await User.find({forgetPasswordToken: token });
    if(user.length === 1) {
        res.render('newpassword.hbs' , {token: token});
    } else {
        const isUserExist = true;
        const errMessage = 'Invalid token, Please checkyour email and try again';
        res.render('resetpswd' , {isUserExist: isUserExist , errMessage: errMessage});
    }
})


router.post('/reset/:token' , async (req,res) => {
    console.log(req.params.token);
    const {token} = req.params;
    const { password } = req.body ;
    const user = await User.find({forgetPasswordToken: token });
    if(user.length === 1) {
        const encPassword = await bcrypt.hash(password , 10);
        user[0].password = encPassword;
        user[0].save();
        res.render('signin' , {email: user[0].email});
    } else {
        const isUserExist = true;
        const errMessage = 'Invalid token, Please checkyour email and try again';
        res.render('resetpswd' , {isUserExist: isUserExist , errMessage: errMessage});
    }
})




router.get('/logout',(req,res) => {
    req.session.destroy();
    res.redirect('/user/signin');
});





module.exports = router;
// Model
const User = require('../models/user');

// hashing module*
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


const homeController = async (req,res) => {
    session=req.session;
    console.log(session);
    if(session.userid){
        try {
            const user = await User.find({email: session.userid});
            let isAdmin = false;
            if(user[0].role === 'admin') {
                isAdmin = true ;
            }
            res.render('home' , {email: session.userid, isAdmin: isAdmin });
        } catch(e) {
            console.log(e);
        }
    } else {
        res.redirect('/user/signin');
    }
}

// const homeController = async (req,res) => {
//     res.render('home')
// }





const signUpController = (req,res) => {
    session=req.session;
    console.log(session);
    if(session.userid){
        res.redirect('/user');
    } else {
        res.render('signup');
    }
}


const registerController = async (req,res) => {
    const {name , email ,password} = req.body ;
    console.log(email);
    try {

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
        const otpExpiry = Date.now() + 2*60*1000;
        
        const newUser = await User.create({
            name: name ,
            email: email ,
            password: encPassword ,
            otp: otp ,
            otpExpiry: otpExpiry
        });


        // OTP Send
        const mailOptions = {
            from: 'admin@gmail.com',
            to: `${email}`,
            subject: 'OTP VERIFICATION',
            html: `<p>Enter <b> ${otp} </b> in the app to verify your email address and complete the signup process. This code expires in 2 minutes</p>`
        };

        await transporter.sendMail(mailOptions);
        console.log(newUser);
        res.render('verifyotp',{email: newUser.email});

    } catch(e) {
        console.log(e);
    }
    
    // res.redirect('/user/signin');
}


const signInController = (req,res) => {
    session=req.session;
    console.log(session);
    if(session.userid){
        res.redirect('/user');
    } else {
        res.render('signin');
    }
}


const verifyController = async (req,res) => {

    const {email , otp} = req.body ;
    console.log(otp);
    console.log(email);
    try {

        const user = await User.find({email:email});
        // console.log(Date.now());
        // console.log(user[0].otpExpiry);
        // console.log(user);
        console.log(Date.now() < user[0].otpExpiry);
        if(parseInt(otp) === user[0].otp) {
        if(Date.now() < user[0].otpExpiry) {
                await User.findOneAndUpdate({email:email} , { $set : {isVerified: true}});
                user[0].otp = undefined;
                user[0].otpExpiry = undefined;
                await user[0].save();
                res.redirect('/user/signin');
        } else {
                const isVerified = true ;
                const errorMessage = 'OTP is already expired'
                res.render('verifyotp' , {email: email , isVerified: isVerified , errMessage:errorMessage});
        }
        } else {
            const isVerified = true ;
            const errorMessage = 'OTP is invalid'
            res.render('verifyotp' , {email: email , isVerified: isVerified , errMessage:errorMessage});
        }


    } catch(e) {
        console.log(e);
    }
    
}

const loginController = async (req,res) => {
    const {email , password} = req.body ;
    try {

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

    } catch(e) {
        console.log(e);
    } 
}

const newOtpController = async (req,res) => {
    const {email} = req.body ;
    console.log(email);
    
    try {
        const user = await User.find({email: email});
        const otp = 1000 + Math.floor(Math.random() * 9000);
        user[0].otp = otp;
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
}

const getResetController = (req,res) => {
    res.render('resetpswd');
}

const postResetController = async (req,res) => {
    const {email} = req.body ;
    try {
        const user = await User.find({email: email});
        if(user.length === 1) {
            let random = (Math.random() + 1).toString(36).substring(3);
            const forgotPswdExpiry = Date.now() + 2*60*1000;
            user[0].forgetPasswordToken = random;
            user[0].forgotPswdExpiry = forgotPswdExpiry;
            await user[0].save();
            const link = `${req.protocol}://${req.get("host")}/user/reset/${random}`;
            console.log(link);
            const mailOptions = {
                from: 'admin@gmail.com',
                to: `${email}`,
                subject: 'RESET PASSWORD',
                html: `To create a new password please <a href=${link}>Click here</a>`
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
    } catch(e) {
        console.log(e);
    }
    
}

const getResetTokenController = async (req,res) => {
    // console.log(req.params.token);
    const {token} = req.params;
    try {
        const user = await User.find({forgetPasswordToken: token });
        if(user.length === 1) {
            res.render('newpassword.hbs' , {token: token});
        } else {
            const isUserExist = true;
            const errMessage = 'Invalid token, Please checkyour email and try again';
            res.render('resetpswd' , {isUserExist: isUserExist , errMessage: errMessage});
        }
    } catch(e) {
        console.log(e);
    }
    
};

const postResetTokenController = async (req,res) => {
    console.log(req.params.token);
    const {token} = req.params;
    const { password } = req.body ;
    try {
        const user = await User.find({forgetPasswordToken: token });
        if(user.length === 1) {
            if(Date.now() < user[0].forgotPswdExpiry) {
                const encPassword = await bcrypt.hash(password , 10);
                user[0].password = encPassword;
                user[0].forgetPasswordToken = undefined ;
                user[0].forgotPswdExpiry = undefined;
                user[0].save();
                res.render('signin' , {email: user[0].email});
            }  else {
                const isUserExist = true;
                const errMessage = 'Token is already expired';
                res.render('resetpswd' , {isUserExist: isUserExist , errMessage: errMessage});
            }
            
        } else {
            const isUserExist = true;
            const errMessage = 'Invalid token, Please checkyour email and try again';
            res.render('resetpswd' , {isUserExist: isUserExist , errMessage: errMessage});
        }

    } catch(e) {
      console.log(e);
    }
    
}

const logoutController = (req,res) => {
    req.session.destroy();
    res.redirect('/user/signin');
}


module.exports = {
    homeController , 
    signUpController , 
    registerController ,
    signInController , 
    verifyController , 
    loginController ,
    newOtpController , 
    getResetController , 
    postResetController , 
    getResetTokenController , 
    postResetTokenController ,
    logoutController
}
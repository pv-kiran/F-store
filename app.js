const express = require('express');
const path = require('path');
const Handlebars = require('handlebars');


const hbs = require('express-handlebars');
const {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access');
const cors = require('cors');

const fileupload = require('express-fileupload');

const mongoose = require('mongoose');
mongoose.set('strictQuery', true);


// session handling setup
const sessions = require('express-session');
const cookieParser = require("cookie-parser");


// application setup
const app = express(); 


require('dotenv').config()
// console.log(process.env);


const {PORT , MONGO_URL } = process.env ;



// built in middleware setup
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(fileupload({useTempFiles: true , tempFileDir:'/temp/'}));
app.use(cors())






// session setup
const oneDay = 1000 * 60 * 60 * 24;
app.use(sessions({
    secret: "thisismysecrctekeyfhrgfgrfrty84fwir767",
    saveUninitialized:true,
    cookie: { maxAge: oneDay },
    resave: false 
}));






// handlebars configuration
// hbs configuration
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");

// root setup for hbs
app.engine(
  "hbs",
  hbs.engine({
    extname: "hbs",
    defaultLayout: "layout",
    layoutDir: __dirname + "/views/layout/",
    partialsDir: __dirname + "/views/partials",
    handlebars: allowInsecurePrototypeAccess(Handlebars)
  })
);




const authRouter = require('./router/auth/auth');
const homeRouter = require('./router/home/home');
const adminRouter = require('./router/admin/admin');
const productRouter = require('./router/product/product');
const cartController = require('./router/cart/cart');


app.use('/user' , authRouter);
app.use('/' , homeRouter);
app.use('/admin' , adminRouter);
app.use('/product', productRouter );
app.use('/cart' , cartController);

// app.get('/' , (req,res) => {
//   session=req.session;
//   console.log(session);
//     if(session.userid){
//         // res.send("Welcome User <a href=\'/logout'>click to logout</a>");
//         res.redirect('/user')
//     }else
//     res.redirect('/user/signin');
// })

// app.get('/dashboard' , (req,res) => {
//    res.render('admin/dashboard');
// })

mongoose.connect(MONGO_URL)
.then(() => {
  app.listen(PORT , () => {
    console.log(`Server is up and running ${PORT}`);
  })
})

.catch((err) => {
   console.log('Server is down');
   console.log(err);
})


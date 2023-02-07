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

require('dotenv').config()



// application setup
const app = express(); 


// console.log(process.env);


// const {PORT , MONGO_URL } = process.env ;



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


app.use((req, res, next) => {
  res.set('cache-control', 'no-cache,private,no-store,must-revalidate,max-stale=0,post-check=0,pre-check=0')
  next();
});


const authRouter = require('./router/auth/auth');
const adminRouter = require('./router/admin/admin');
const productRouter = require('./router/product/product');
const cartController = require('./router/cart/cart');
const homeRouter = require('./router/home/home');
const profileRouter = require('./router/user/profile');
const orderRouter = require('./router/order/order');

app.use('/user' , authRouter);
app.use('/admin' , adminRouter);
app.use('/product', productRouter );
app.use('/profile' ,profileRouter );
app.use('/cart' , cartController);
app.use('/order' , orderRouter);
app.use('/' , homeRouter);


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


const PORT = process.env.PORT || 4000;


mongoose.connect(process.env.MONGO_URL)
.then(() => {
  app.listen(PORT , () => {
    console.log(`Server is up and running ${PORT}`);
  })
})

.catch((err) => {
   console.log('Server is down');
   console.log(err);
})


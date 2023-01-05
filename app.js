const express = require('express');
const path = require('path');
const Handlebars = require('handlebars')
const hbs = require('express-handlebars');
const {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access');
var cors = require('cors');


const app = express(); 

const PORT = process.env.port || 3000 ;

// built in middleware setup
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({extended: false}));
app.use(express.json());



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







app.get('/' , (req,res) => {
    res.render('admin/dashboard');
})




app.listen(PORT , () => {
    console.log('Server is up and running');
})
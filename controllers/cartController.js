const User = require('../models/user');

const getCart = async (req,res) => {

    let isLoggedIn;
    if(req.session.userid) {
      isLoggedIn = true
    } else {
        isLoggedIn = false
    }

    try {

        const user = await User.find({email: req.session.userid}).populate('cart.id');
        if(user[0].cart.length === 0) {
               
            res.render('emptyCart' , { isLoggedIn: isLoggedIn , id: req.session._userId });

        } else {
            user[0].cart.forEach((item) => {
                if(item.quantity >= item.id.stock) {
                    console.log(item.quantity) ;
                    console.log(item.id.stock);
                }
            }) ;
            const cartItems = user[0].cart.filter(item => item.id.isBlocked === false);
            console.log(cartItems)
            const totalQuantity = cartItems.reduce((total , item) => {
                return total+item.quantity;
            } , 0);
            const totalPrice = cartItems.reduce((total , item) => {
                return total+ (item.quantity * item.id.price) 
            } , 0);
            cartItems.forEach((item) => {
                if(item.quantity >= item.id.stock) {
                    console.log(item.quantity);
                    console.log(item.id.stock)
                    item.isUpDisable = true
                } 
                else if(item.quantity === 1) {
                    item.isDownDisable = true;
                }
            })
            console.log(cartItems);
            res.render('cart' , {cartItems : cartItems , totalQuantity: totalQuantity , totalPrice: totalPrice , isLoggedIn: isLoggedIn , id: req.session._userId});
        }
        
    } catch (e) {
        console.log(e);
    }
    
}

const addToCart = async (req,res) => {
    const {id} = req.params ;
    
    try {
        const user = await User.find({email: req.session.userid});
        const item = {
            id: id ,
            quantity: 1
        };
        if(user[0].cart.length === 0) {
            user[0].cart.push(item);
            user[0].save();
        } else {
            
            const res = user[0].cart.findIndex((item) => {
                return item.id.valueOf() === `${id}`
            })

            if(res === -1) {
                user[0].cart.push(item);
            } else {
                user[0].cart[res].quantity = user[0].cart[res].quantity + 1;
            }
            
            user[0].save();
           
        }
    } catch(e) {
        console.log(e);
    }

    res.redirect('/cart');
    
}

const cartIncrement = async  (req,res) => {
    const {id} = req.params;
    try {
        const user = await User.find({email: req.session.userid});
        const index =  user[0].cart.findIndex((item) => { return item.id.valueOf() === `${id}` });
        user[0].cart[index].quantity = user[0].cart[index].quantity + 1;
        await  user[0].save();
        res.json({redirect: '/cart'});
    } catch(e) {
        console.log(e);
    }
}

const cartDecrement = async  (req,res) => {
    const {id} = req.params;
    try {
        const user = await User.find({email: req.session.userid});
        const index =  user[0].cart.findIndex((item) => { return item.id.valueOf() === `${id}` });
        user[0].cart[index].quantity = user[0].cart[index].quantity - 1;
        await  user[0].save();
        res.json({redirect: '/cart'});
    } catch(e) {
        console.log(e);
    }
}

const cartDelete = async (req,res) => {
    const {id} = req.params;
    try {
        const user = await User.find({email: req.session.userid});
        const index =  user[0].cart.findIndex((item) => { return item.id.valueOf() === `${id}` })
        console.log(index);
        user[0].cart.splice(index , 1);
        user[0].save();
        res.json({redirect: '/cart'});
    }  catch(e) {
        console.log(e);
    }
    
}

module.exports = {
    getCart  ,
    addToCart ,
    cartIncrement ,
    cartDecrement ,
    cartDelete
}
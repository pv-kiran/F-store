const User = require('../models/user');
const Order = require('../models/order');
const Product = require('../models/product');

const getOrderDetails = async (req,res) => {

    let isLoggedIn;
    if(req.session.userid) {
      isLoggedIn = true
    } else {
        isLoggedIn = false
    }

    try {

        const user = await User.find({email: req.session.userid}).populate('cart.id');
        // user[0].cart.forEach((item) => {
        //     if(item.quantity >= item.id.stock) {
        //         console.log(item.quantity) ;
        //         console.log(item.id.stock);
        //     }
        // }) ;
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
        res.render('orderdetails' , {user: user[0] ,cartItems : cartItems , totalQuantity: totalQuantity , totalPrice: totalPrice , isLoggedIn: isLoggedIn , id: req.session._userId});
    } catch (e) {
        console.log(e);
    }
    
}

const newShippingAddress = async (req,res) => {
    const {id} = req.params;
    try {
        const user = await User.find({_id: id});
        user[0].address.push(req.body);
        user[0].save();
        res.redirect(`/order`);
    } catch(e) {
        console.log(e);
    }
}

const createOrder = async (req,res) => {
    const { totalAmount , orderStatus , paymentMethod , shippingInfo  } = req.body ;

    try {

        const user = await User.find({_id: req.session._userId});
        const index = user[0].address.findIndex((item) => {
            return item._id.valueOf() == shippingInfo ;
        })
        let shippingAddres = user[0].address[index];
    
        // crating the order
        const newOrder = await Order.create({
            shippingInfo: shippingAddres ,
            user: req.session._userId ,
            orderItems: user[0].cart ,
            totalAmount: totalAmount ,
            orderStatus: orderStatus ,
            paymentMode: paymentMethod ,
        })
    
        // removing the cart items
        await user[0].cart.splice(0);
        console.log(user[0].cart);
        await user[0].save({validateBeforeSave: false});
        
        // updating the product stock
        const updateStock = async (productId , quantity) => {
             const product = await Product.find({_id:productId});
             product[0].stock = product[0].stock - quantity ;
             product[0].save({validateBeforeSave: false});
        }
    
        newOrder.orderItems.forEach(async (item) => {
            await updateStock(item.id , item.quantity )
        })
    
        //saving the order
        await newOrder.save();

    } catch(e) {
        console.log(e);
    }
    
}

const getUserOrder = async  (req,res) => {
    // const {id} = req.params;
    let isLoggedIn;
    if(req.session.userid) {
      isLoggedIn = true;
    } else {
        isLoggedIn = false;
    }
    try {
        const orders = await Order.find({user: req.session._userId}).populate('orderItems.id');
        console.log(orders);
        console.log(orders[0].orderItems);
        res.render('userorders' , {order: orders ,isLoggedIn: isLoggedIn , id: req.session._userId});
    } catch(e) {
        console.log(e);
    }
    
}

const cancelOrder = async (req,res) => {
    const id = req.params.id;

    try {
        const order = await Order.find({id: id});
        console.log(order[0].orderItems);
    
        const updateStock = async (productId , quantity) => {
            const product = await Product.find({_id:productId});
            product[0].stock = product[0].stock + quantity ;
            product[0].save({validateBeforeSave: false});
       }
    
       order[0].orderItems.forEach(async (item) => {
           await updateStock(item.id , item.quantity )
       })
    
       const cancelOrder = await Order.findOneAndUpdate({_id: id} , {isCancelled: true});
       console.log(cancelOrder);
    } catch(e) {
        console.log(e);
    }
    

}


module.exports = {
    getOrderDetails,
    newShippingAddress ,
    createOrder ,
    getUserOrder , 
    cancelOrder
}
const User = require('../models/user');
const Order = require('../models/order');
const Product = require('../models/product');
const Coupon = require('../models/coupon');

const Razorpay = require('razorpay');


const getOrderDetails = async (req,res) => {

    let isLoggedIn;
    if(req.session.userid) {
      isLoggedIn = true
    } else {
        isLoggedIn = false
    }

    try {

           const user = await User.find({email: req.session.userid}).populate('cart.id');

            let isCouponExist = false ;
        
            const cartItems = user[0].cart.filter(item => item.id.isBlocked === false);
            console.log(cartItems)
            const totalQuantity = cartItems.reduce((total , item) => {
                return total+item.quantity;
            } , 0);
            const totalPrice = cartItems.reduce((total , item) => {
                return total+ (item.quantity * item.id.price) 
            } , 0);

            
            let coupon =  await Coupon.find({isAvailable: true , expiryDate: { $gt: Date.now()}});
            if(coupon.length > 0) {
                isCouponExist = true;
            }

            res.render('orderdetails' , {user: user[0] ,cartItems : cartItems , totalQuantity: totalQuantity , totalPrice: totalPrice , isLoggedIn: isLoggedIn , id: req.session._userId , isCouponExist: isCouponExist});
        
    } catch (e) {
        console.log(e);
    }
    
}

const applyCoupon = async (req,res) => {

    let isLoggedIn;
    if(req.session.userid) {
    isLoggedIn = true
    } else {
    isLoggedIn = false
    }

    try {

            const user = await User.find({email: req.session.userid}).populate('cart.id');

    
            const cartItems = user[0].cart.filter(item => item.id.isBlocked === false);
            const totalQuantity = cartItems.reduce((total , item) => {
            return total+item.quantity;
            } , 0);

            let totalPrice = cartItems.reduce((total , item) => {
            return total+ (item.quantity * item.id.price) 
            } , 0);

            const coupon = await Coupon.find({couponCode: req.body.coupon});
            // console.log(coupon[0].discountPercentage);

            console.log(coupon[0].users);
            let isCouponUsed = coupon[0].users.some((item) => {
                    return item.id.valueOf() === `${req.session._userId}`
            });

            let isCouponExist = false ;

            if(isCouponUsed) {
                    res.render('orderdetails' , {user: user[0] ,cartItems : cartItems , totalQuantity: totalQuantity , totalPrice: totalPrice , isLoggedIn: isLoggedIn , id: req.session._userId , isCouponExist: isCouponExist , isCouponUsed: isCouponUsed ,
                            couponMsg: 'Oops ..!! Coupon already used' });
            }  else {
                 let isCouponUsed = true;
                 if(totalPrice <= coupon[0].minDiscountAmount) {
                    res.render('orderdetails' , {user: user[0] ,cartItems : cartItems , totalQuantity: totalQuantity , totalPrice: totalPrice , isLoggedIn: isLoggedIn , id: req.session._userId , isCouponExist: isCouponExist , isCouponUsed: isCouponUsed ,
                            couponMsg: 'Coupon is only applicable if purchase amount exeeds 3500' });
                 }
                 else {


                         let coupenUser = {
                            id: req.session._userId
                         }
                         coupon[0].users.push(coupenUser);
                         await coupon[0].save();
                         totalPrice = totalPrice - (totalPrice * coupon[0].discountPercentage) / 100;
                         console.log(totalPrice);
                    
                    //      let isCouponExist = false ;
    
                         res.render('orderdetails' , {user: user[0] ,cartItems : cartItems , totalQuantity: totalQuantity , totalPrice: totalPrice , isLoggedIn: isLoggedIn , id: req.session._userId , isCouponExist: isCouponExist });

                 }

            }

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
    
        let newOrder;

        // Cash on delivery
        if(paymentMethod === 'Cash on delivery') {

            // adding item to order db
            newOrder = await Order.create({
                            shippingInfo: shippingAddres ,
                            user: req.session._userId ,
                            orderItems: user[0].cart ,
                            totalAmount: totalAmount ,
                            orderStatus: orderStatus ,
                            paymentMode: paymentMethod ,
                       })

            // removing the cart items
            await user[0].cart.splice(0);
            // console.log(user[0].cart);
            await user[0].save({validateBeforeSave: false});

            // updating the product stock
            const updateStock = async (productId , quantity) => {
                const product = await Product.find({_id:productId});
                product[0].stock = product[0].stock - quantity ;
                product[0].save({validateBeforeSave: false});
            }

            // updating the product stock
            newOrder.orderItems.forEach(async (item) => {
                await updateStock(item.id , item.quantity )
            })

            // saving the order
            await newOrder.save();
            res.json({redirect: '/order/success'});

        }

        else if(paymentMethod === 'Razor Pay') {
            // integration with razorpay
            
               // this should go in env
               let instance = new Razorpay({
                key_id: 'rzp_test_I7TMRHjNEnfLbl',
                key_secret: 'iMwgAhmFKNbOOI3JMbKJtkSS'
               });


               const myOrder = await instance.orders.create({
                    amount: totalAmount * 100,
                    currency: "INR",
                    receipt: "receipt#1"
               })

               console.log(myOrder);


               const newOrder = await Order.create({
                    shippingInfo: shippingAddres ,
                    user: req.session._userId ,
                    orderItems: user[0].cart ,
                    totalAmount: totalAmount ,
                    paymentMode: paymentMethod ,
                    orderId: myOrder.id
               });

            
    
                // saving the order
                await newOrder.save();
                res.json({myOrder: myOrder});

                // res.json({myOrder: myOrder , redirect: '/order/success'});

        }

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
        const orders = await Order.find({user: req.session._userId}).sort({'createdAt': -1}).populate('orderItems.id');
        console.log(orders);
        if(orders.length === 0) {
            res.render('emptyorder' , {isLoggedIn: isLoggedIn , id: req.session._userId});
        } else {
            res.render('userorders' , {order: orders ,isLoggedIn: isLoggedIn , id: req.session._userId});
        }
    } catch(e) {
        console.log(e);
    }
    
}

const razorPaySuccess = async (req,res) => {
    const {id} = req.params ;
    const {paymentId} = req.body ;

    try {

        const user = await User.find({_id: req.session._userId});
        const order = await Order.find({orderId: id});
        order[0].paymentId = paymentId ;
    
        const updateStock = async (productId , quantity) => {
            const product = await Product.find({_id:productId});
            product[0].stock = product[0].stock + quantity ;
            product[0].save({validateBeforeSave: false});
        }
    
       order[0].orderItems.forEach(async (item) => {
           await updateStock(item.id , item.quantity )
       })
    
       // removing the cart items
       await user[0].cart.splice(0);
       await user[0].save({validateBeforeSave: false});
       await order[0].save({validateBeforeSave:false});
       res.json({redirect: '/order/success'});

    }  catch(e) {
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
    
       await Order.findOneAndUpdate({_id: id} , {isCancelled: true})
       res.json({redirect: '/order/myorder'});
    } catch(e) {
        console.log(e);
    }
    

}

const removeOrder = async (req,res) => {
    const id = req.params.id;
    console.log(id);
    try {
    await Order.findOneAndDelete({orderId:id});
    res.json({redirect: '/order'});

    } catch(e) {
        console.log(e);
    }
}


const orderSuccess =  (req,res) => {
    res.render('ordersuccess');
}

module.exports = {
    getOrderDetails,
    newShippingAddress ,
    createOrder ,
    getUserOrder , 
    cancelOrder ,
    removeOrder ,
    orderSuccess ,
    applyCoupon ,
    razorPaySuccess
}






























// create order logic

   // removing the cart items
            //    await user[0].cart.splice(0);
            //    await user[0].save({validateBeforeSave: false});

                // updating the product stock
            //    const updateStock = async (productId , quantity) => {
            //       const product = await Product.find({_id:productId});
            //       product[0].stock = product[0].stock - quantity ;
            //       product[0].save({validateBeforeSave: false});
            //    }
    
            //     newOrder.orderItems.forEach(async (item) => {
            //         await updateStock(item.id , item.quantity )
            //     })
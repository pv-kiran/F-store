const mongoose = require('mongoose');


const userSchema = new mongoose.Schema({
    name: {
        type: String ,
        required: true
    } ,
    email: {
        type: String ,
        required: true
    } ,
    password: {
        type: String ,
        required: true
    } , 
    role: {
        type: String
    } ,
    isBlocked: {
        type: Boolean
    } ,
    otp : {
        type: Number 
    } ,
    otpExpiry: {
        type: Date
    } ,
    cart: [
        {
           id: {
             type: mongoose.SchemaTypes.ObjectId ,
             ref: "product"
           } ,
           quantity: {
             type: Number
           }
        }
     ]  ,

    forgetPasswordToken: {
       type: String
    } ,
    forgotPswdExpiry: {
       type: Date
    } ,
    isVerified: {
        type: Boolean ,
        default: false
    }
})



module.exports = mongoose.model('user' , userSchema);
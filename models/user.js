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
    address: [
        {
            houseName: {
              type : String ,
              required: true
            } ,
            phone: {
              type : Number ,
              required: true
            },
            city: {
              type : String ,
              required: true
            } ,
            postalCode: {
              type : String ,
              required: true
            },
            state: {
              type : String ,
              required: true
            },
            coutry: {
              type : String ,
              required: true
            }
        }
    ] ,
    password: {
        type: String ,
        required: true
    } , 
    isBlocked: {
        type: Boolean,
        default: false
    } ,
    otp : {
        type: Number 
    } ,
    otpExpiry: {
        type: Date
    } ,
    role: {
        type: Boolean
    } ,
    cart: [
        {
           id: {
             type: mongoose.SchemaTypes.ObjectId ,
             ref: "product"
           } ,
           quantity: {
             type: Number
           } ,
           isUpDisable: {
             type: Boolean
           } ,
           isDownDisable: {
             type: Boolean
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
    } ,
    role: {
        type: String
    } 
})



module.exports = mongoose.model('user' , userSchema);
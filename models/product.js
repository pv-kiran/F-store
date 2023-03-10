const mongoose = require('mongoose');


const productSchema =new mongoose.Schema({
    productName: {
        type: String ,
        required: true, 
        trim: true
    } ,
    price: {
        type: Number ,
        required: true
    } ,
    actualPrice: {
        type: Number ,
        required: true
    }  ,
    description: {
        type: String, 
        required: true
    } ,
    images: [
        {
            id: {
                type: String , 
                required: true
            } , 
            secured_url : {
                type: String , 
                required: true
            }
        }
    ] ,
    categories: {
        type: mongoose.SchemaTypes.ObjectId ,
        ref: 'category'
    } , 
    material: {
        type: String , 
        required: true
    } ,
    productDimension: {
        type: String ,
        required: true
    } ,
    manufacturedBy: {
        type: String ,
        required: true
    } ,
    marketedBy: {
        type: String ,
        required: true
    } ,
    stock: {
        type: Number ,
        required: true
    } ,
    offer: {
        type: Number
    } ,
    isOfferAvailable: {
        type: Boolean ,
        default: false
    },
    countryOfOrigin : {
        type: String ,
        required: true
    } ,
    isBlocked : {
        type: Boolean ,
        default: false
    } 
})



module.exports = mongoose.model('product' , productSchema);
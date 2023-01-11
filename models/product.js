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
        type: String ,
        required: true ,
        enum: {
            values : [
                'Table',
                'Chair' ,
                'Light'
            ]
        }
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
    countryOfOrigin : {
        type: String ,
        required: true
    } ,
    isBlocked : {
        type: Boolean 
    }
})



module.exports = mongoose.model('product' , productSchema);
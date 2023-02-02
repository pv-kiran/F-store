const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    categoryName: {
        type: String ,
        required: true
    } ,
    offer: {
        type: Number
    } ,
    isOfferAvailable: {
        type: Boolean ,
        default: false
    },
    isAvailable: {
        type: Boolean 
    }

})

module.exports = mongoose.model('category' , categorySchema);
const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    categoryName: {
        type: String ,
        required: true
    } ,
    isAvailable: {
        type: Boolean 
    }
})

module.exports = mongoose.model('category' , categorySchema);
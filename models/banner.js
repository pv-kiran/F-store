const mongoose = require('mongoose');

const bannerSchema = new mongoose.Schema({
    id: {
        type: String , 
        required: true
    } , 
    secured_url : {
        type: String , 
        required: true
    } ,
    isActive: {
        type: Boolean ,
        default: false
    }
});

module.exports = mongoose.model('banner' , bannerSchema);
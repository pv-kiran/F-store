const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({

    shippingInfo: {

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
    } ,
    user: {
       type: mongoose.SchemaTypes.ObjectId ,
       ref: 'user' ,
       required: true
    } ,
    orderItems: [
        {
            id: {
              type: mongoose.SchemaTypes.ObjectId ,
              ref: "product"
            } ,
            quantity: {
              type: Number
            } 
        }
    ] ,
    orderId: {
      type: String
    } ,
    paymentId: {
      type: String
    } ,
    totalAmount : {
        type: Number ,
        required: true
    } ,
    paymentMode: {
        type: String ,
        required: true
    } ,
    trackingInfo: {
      type: String,
      default: 'Placed'
    } ,
    isDelivered: {
      type: Boolean ,
      default: false
    } ,
    refundStatus: {
      type: Boolean
    } ,
    isReturn: {
      type: Boolean
    } ,
    isCancelled: {
       type: Boolean ,
       default: false
    } ,
    createdAt: {
        type: Date ,
        default: Date.now()
    } , 
    deliveredAt: {
        type: Date
    }
})


module.exports = mongoose.model('order' , orderSchema )







 



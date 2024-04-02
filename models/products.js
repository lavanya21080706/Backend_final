const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  headphone_type: {
    type: String,
    
  },
  company: {
    type: String,
   
  },
  color: {
    type: String,
  },
  price: {
    type: Number,
  },
  rating: {
    type: Number,
    min: 0, // Minimum allowed rating
    max: 5, // Maximum allowed rating
    default: 0, // Default rating if not provided
  },
 about:{
    type:String,
},
available:{
    type:String,
},
ProductName:{
    type:String,
},
Images:{
    type:[String],
},
product_description:{
    type:String,
},
review:{
  type:String,
},
Quantity: {
  type: Number,
  default: 0,
  validate: {
    validator: function(value) {
      return value <= 8; // Maximum allowed value is 8
    },
    message: props => `Quantity cannot exceed 8!`
  }
},
CardStatus: {
  type: String,
  default: 'false',
},
fee:{
  type:Number,
},
discount:{
  type:Number,
},
delivery:{
  type: String,
}
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
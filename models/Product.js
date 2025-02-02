const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  title: { type: String, required: true },
  price: { type: Number, required: true },
  categoryType: { type: String, required: true},
  menuType: { type: String, required: true},
  image: { type: String, required: true }, 
});

productSchema.methods.formatPrice = function() {
  return this.price.toFixed(2);
};


module.exports = mongoose.model('Product', productSchema);
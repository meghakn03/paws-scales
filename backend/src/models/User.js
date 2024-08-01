const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // Make sure to hash passwords before saving
  cart: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }], // Array of product references
  orders: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Order' }], // Array of order references
  products: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }] // Products listed by the user
});

const User = mongoose.model('User', userSchema);

module.exports = User;

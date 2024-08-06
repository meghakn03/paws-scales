const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // Make sure to hash passwords before saving
  cart: { type: Map, of: Number }, // Change to use Map for key-value pairs
  orders: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Order' }], // Array of order references
  products: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }]
});

const User = mongoose.model('User', userSchema);

module.exports = User;

const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getUserById, updateUser, deleteUser, addToCart, placeOrder  } = require('../controllers/userController');

// Register a new user
router.post('/register', registerUser);

// Login a user
router.post('/login', loginUser);

// Get user by ID
router.get('/:id', getUserById);

// Update user
router.put('/:id', updateUser);

// Delete user
router.delete('/:id', deleteUser);

// Add product to cart
router.post('/add-to-cart', addToCart);

// Place an order
router.post('/place-order', placeOrder);




module.exports = router;

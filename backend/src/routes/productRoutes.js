const express = require('express');
const router = express.Router();
const { getAllProducts, getProductById, createProduct } = require('../controllers/productController');

// Get all products
router.get('/products', getAllProducts);

// Get product by ID
router.get('/products/:id', getProductById);

// Add a new product
router.post('/products', createProduct);

module.exports = router;

// productRoutes.js
const express = require('express');
const router = express.Router();
const { getAllProducts, getProductById, createProduct, getProductsByCategoryAndSubCategory } = require('../controllers/productController');

// Get all products
router.get('/products', getAllProducts);

// Get product by ID
router.get('/products/:id', getProductById);

// Add a new product
router.post('/products', createProduct);

// Route to get products by category and subCategory
router.get('/products/filter', getProductsByCategoryAndSubCategory);

module.exports = router;

// productRoutes.js
const express = require('express');
const router = express.Router();
const { getAllProducts, getProductById, createProduct, getProductsByCategoryAndSubCategory, getProductsByIds } = require('../controllers/productController');

// Get all products
router.get('/products', getAllProducts);

// Get product by ID
router.get('/products/:id', getProductById);

// Add a new product
router.post('/products', createProduct);

// Route to get products by category and subCategory
router.get('/products/filter', getProductsByCategoryAndSubCategory);

// Route to get products by a list of IDs
router.post('/products/by-ids', getProductsByIds);

module.exports = router;

// GET /api/products/products: Should list all products.
// GET /api/products/products/:id: Should get a product by ID.
// POST /api/products/products: Should create a new product.
// GET /api/products/products/filter: Should filter products by category and subcategory.
// POST /api/products/products/by-ids: Should get products by a list of IDs.
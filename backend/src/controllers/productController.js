const Product = require('../models/Product');

const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getProductsByCategoryAndSubCategory = async (req, res) => {
  const { category, subCategory } = req.query;

  if (!category || !subCategory) {
    return res.status(400).json({ message: 'Category and subCategory are required' });
  }

  try {
    // Fetch products by category and subCategory
    const products = await Product.find({ category, subCategory });
    res.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ message: error.message });
  }
};

const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createProduct = async (req, res) => {
  const { name, description, price, category, subCategory, imageUrl, quantity, userId } = req.body;

  if (!userId) {
    return res.status(400).json({ message: 'User ID is required' });
  }

  try {
    const newProduct = new Product({
      name,
      description,
      price,
      category,
      subCategory,
      imageUrl,
      quantity,
      user: userId  // Associate product with the user
    });
    const savedProduct = await newProduct.save();
    res.status(201).json(savedProduct);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getAllProducts, getProductById, createProduct, getProductsByCategoryAndSubCategory };

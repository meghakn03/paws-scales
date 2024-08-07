// routes/orderRoutes.js
const express = require('express');
const router = express.Router();
const Order = require('../models/Order');

// Fetch orders by IDs
router.post('/orders', async (req, res) => {
  try {
    const { ids } = req.body;
    const orders = await Order.find({ _id: { $in: ids } }).exec();
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching orders' });
  }
});

module.exports = router;

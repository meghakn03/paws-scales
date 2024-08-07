const User = require('../models/User');
const Order = require('../models/Order');
const bcrypt = require('bcrypt');
const saltRounds = 10;

// Register a new user
const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        const newUser = new User({ name, email, password: hashedPassword });
        const savedUser = await newUser.save();
        res.status(201).json(savedUser);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Login a user
const loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (user && await bcrypt.compare(password, user.password)) {
            res.json(user);
        } else {
            res.status(401).json({ message: 'Invalid credentials' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get user by ID
const getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update user
const updateUser = async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete user
const deleteUser = async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json({ message: 'User deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Add product to cart
const addToCart = async (req, res) => {
  const { userId, productId } = req.body;
  try {
    const user = await User.findById(userId);
    if (user) {
      // Add product ID to cart array
      if (!user.cart.includes(productId)) {
        user.cart.push(productId);
        await user.save();
      }
      res.status(200).json(user);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// Place an order
const placeOrder = async (req, res) => {
  const { userId, products, totalAmount } = req.body;
  try {
    const newOrder = new Order({ user: userId, products, totalAmount });
    const savedOrder = await newOrder.save();

    // Update user's order history and clear cart
    const user = await User.findById(userId);
    if (user) {
      user.orders.push(savedOrder._id);
      user.cart = []; // Clear the user's cart
      await user.save();
      res.status(201).json(savedOrder);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get orders for a user by user ID
const getUserOrders = async (req, res) => {
  try {
      const userId = req.params.id;
      const user = await User.findById(userId).populate('orders'); // Populate orders based on order IDs
      if (!user) {
          return res.status(404).json({ message: 'User not found' });
      }
      const orders = user.orders; // Orders are already populated
      res.json(orders);
  } catch (error) {
      res.status(500).json({ message: error.message });
  }
};



module.exports = { registerUser, loginUser, getUserById, updateUser, deleteUser, addToCart, placeOrder, getUserOrders };

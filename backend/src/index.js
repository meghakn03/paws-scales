require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer'); // Import multer
const path = require('path'); // Import path for file handling

const app = express();
const port = process.env.PORT || 5000;
const mongoURI = process.env.MONGODB_URI;

// Configure CORS
app.use(cors()); // Allow all origins by default

// Middleware to parse JSON
app.use(express.json());

// Serve static files from the 'uploads' directory
app.use('/uploads', express.static('uploads'));

// Configure file upload with multer
const upload = multer({
  dest: 'uploads/', // Directory to save uploaded files
  limits: { fileSize: 10 * 1024 * 1024 } // Limit file size to 10MB
});

// Log incoming requests
app.use((req, res, next) => {
  console.log(`Incoming request: ${req.method} ${req.url}`);
  next();
});

// Handle file upload
app.post('/api/upload', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded');
  }
  
  // Construct the file URL
  const imageUrl = `http://localhost:${port}/uploads/${req.file.filename}`;
  
  res.json({ imageUrl });
});

// Include product routes under /api/products
const productRoutes = require('./routes/productRoutes');
app.use('/api/products', productRoutes);

// Include user routes under /api/users
const userRoutes = require('./routes/userRoutes');
app.use('/api/users', userRoutes);

// Include order routes under /api/orders
const orderRoutes = require('./routes/orderRoutes');
app.use('/api/orders', orderRoutes);

mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');

const app = express();

const port = process.env.PORT || 5000;
const mongoURI = process.env.MONGODB_URI;

mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

// Middleware to parse JSON
app.use(express.json());

// Include product routes
const productRoutes = require('./routes/productRoutes');
app.use('/api', productRoutes);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

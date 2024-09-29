const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const multer = require('multer');
const connectDB = require('./config/database');
const path = require('path'); // Add this for serving static files
const authRoutes = require('./routes/auth');
const orderRoutes = require('./routes/order');
const userRoutes = require('./routes/user');
const profileRoutes = require('./routes/profile');
const categoryRoutes = require('./routes/category');
const historyRoutes = require('./routes/history');
const productRoutes = require('./routes/product');
// require('dotenv').config();

// Database connection
connectDB();

app.use(cors());

app.use(bodyParser.json());

// Serve static Angular files
app.use(express.static(path.join(__dirname, 'dist/front-end')));
app.get('/*', function(req, res) {
  res.sendFile(path.join(__dirname, 'dist/front-end/index.html'));
});

// Routes
app.use('/', authRoutes);
app.use('/order', orderRoutes);
app.use('/user', userRoutes);
app.use('/profile', profileRoutes);
app.use('/category', categoryRoutes);
app.use('/history', historyRoutes);
app.use('/product', productRoutes);

// Use the environment-provided port, or default to 4000
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

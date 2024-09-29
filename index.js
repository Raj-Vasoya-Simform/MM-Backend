const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const multer = require('multer');
const connectDB = require('./config/database')
const authRoutes = require('./routes/auth');
const orderRoutes = require('./routes/order');
const userRoutes = require('./routes/user');
const profileRoutes = require('./routes/profile');
const categoryRoutes = require('./routes/category');
const historyRoutes = require('./routes/history');
const productRoutes = require('./routes/product');
// require('dotenv').config()

// Database connection
connectDB();

app.use(cors());


app.use(bodyParser.json());
// Routes
app.use('/', authRoutes);
app.use('/order', orderRoutes);
app.use('/user', userRoutes);
app.use('/profile', profileRoutes);
app.use('/category', categoryRoutes);
app.use('/history', historyRoutes);
app.use('/product', productRoutes);

const PORT = 4000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

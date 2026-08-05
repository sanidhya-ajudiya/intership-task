const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { connectDB } = require('./config/db');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

// Route Imports
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');
const wishlistRoutes = require('./routes/wishlistRoutes');
const cartRoutes = require('./routes/cartRoutes');
const orderRoutes = require('./routes/orderRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');

dotenv.config();

// Connect Database
connectDB();

const app = express();

// Middlewares
app.use(cors({
  origin: (origin, callback) => callback(null, true),
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health Check API
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Role-Based E-Commerce API is running smoothly' });
});

// API Routes (Mounted under /api and root endpoints as per spec requirements)
app.use('/api', authRoutes); // /register, /login, /profile
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Direct root route mappings for exact backend API match requirement
app.use('/', authRoutes);

// Error Middleware
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});
require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();

// Middleware
// ✅ Konfigurasi CORS yang benar
app.use(cors({
  origin: [
    'https://laundrygofrm.netlify.app',
    'https://vermillion-puppy-ea84e8.netlify.app',
    'http://localhost:5173',
    'http://localhost:3000'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const orderRoutes = require('./routes/orderRoutes');
app.use('/api/orders', orderRoutes);

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/laundry', require('./routes/laundry'));
app.use('/api/track', require('./routes/track'));

// Health check
app.get('/api', (req, res) => {
  res.json({ 
    status: 'LaundryGo API Running', 
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server Express.js berjalan di http://localhost:${PORT}`);
});
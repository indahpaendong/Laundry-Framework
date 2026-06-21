require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();

// ✅ Konfigurasi CORS
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

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/orders', require('./routes/orderRoutes'));
app.use('/api/track', require('./routes/track'));
app.use('/api/laundry', require('./routes/laundry'));

// Health check
app.get('/api', (req, res) => {
  res.json({ 
    status: 'LaundryGo API Running', 
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

// Root route
app.get('/', (req, res) => {
  res.json({ 
    message: 'LaundryGo Backend API',
    docs: 'Visit /api for documentation'
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
  console.log(`🚀 Server Express.js berjalan di port ${PORT}`);
});
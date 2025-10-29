const express = require('express');
const https = require('https');
const fs = require('fs');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const db = require('./config/database');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.set('trust proxy', 1);
app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginEmbedderPolicy: false
}));

app.use(cors({
  origin: [
    'https://localhost:8443',
    'http://localhost:8080',
    'https://localhost',
    'http://localhost'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later'
});
app.use('/api/', limiter);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// Routes
const authRoutes = require('./routes/auth');
const patientRoutes = require('./routes/patients');
const medicalRecordRoutes = require('./routes/medical-records');
const userRoutes = require('./routes/users');

app.use('/api/auth', authRoutes);
app.use('/api/patients', patientRoutes);
app.use('/api/records', medicalRecordRoutes);
app.use('/api/users', userRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// Start server with HTTPS
const startServer = async () => {
  try {
    // Test database connection
    await db.testConnection();
    console.log('✅ Database connected successfully');

    // Load SSL certificates
    const sslOptions = {
      key: fs.readFileSync('/app/certs/backend-key.pem'),
      cert: fs.readFileSync('/app/certs/backend-cert.pem'),
      ca: fs.readFileSync('/app/certs/ca-cert.pem')
    };

    // Start HTTP server (simpler for development)
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`🚀 Server running on HTTP port ${PORT}`);
      console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
    });

  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

startServer();


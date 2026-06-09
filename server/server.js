const express = require('express');
const http = require('http');
const socketio = require('socket.io');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// Error Middleware
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

// Auto-seed utility
const autoSeedDB = require('./utils/seedDB');

// Route files
const authRoutes = require('./routes/authRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const menuRoutes = require('./routes/menuRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const venueRoutes = require('./routes/venueRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const seedRoutes = require('./routes/seedRoutes');

// Load environment variables
dotenv.config();

// Connect to Database
connectDB();

const app = express();
const server = http.createServer(app);

// Configure CORS
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'https://dineverse-phi.vercel.app',
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('CORS not allowed'));
    }
  },
  credentials: true,
}));

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Initialize Socket.IO Server
const io = socketio(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE'],
    credentials: true,
  }
});

// Set global Socket.IO instance on app to access inside controllers
app.set('socketio', io);

io.on('connection', (socket) => {
  console.log(`🔌 New client connected to Socket.IO: ${socket.id}`);

  socket.on('disconnect', () => {
    console.log(`🔌 Client disconnected: ${socket.id}`);
  });
});

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/menu', menuRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/venues', venueRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/seed', seedRoutes);

// Test endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date() });
});

// Error handling
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

server.listen(PORT, async () => {
  console.log(`🚀 DineVerse Luxury Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
  
  // Auto-seed database on first startup
  await autoSeedDB();
});

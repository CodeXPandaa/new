import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import authRoutes from './routes/auth.js';
import projectRoutes from './routes/projects.js';
import wprRoutes from './routes/wpr.js';
import analyticsRoutes from './routes/analytics.js';

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Database Connection
// Prefer env var; fall back to IPv4 localhost to avoid IPv6 (::1) ECONNREFUSED on some Windows setups
mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/project_management_app')
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/wpr', wprRoutes);
app.use('/api/analytics', analyticsRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'Server running' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

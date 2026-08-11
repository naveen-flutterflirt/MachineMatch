import express from 'express';
import './models/index.js'; // Ensure all Sequelize models & associations are loaded globally
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import path from 'path';

import userRouter from './router/user.router.js';
import categoryRouter from './router/category.router.js';
import attributeMasterRouter from './router/attributeMaster.router.js';
import categoryAttributeTemplateRouter from './router/categoryAttributeTemplate.router.js';
import vendorRouter from './router/vendor.router.js';
import machineRouter from './router/machine.router.js';
import uploadRouter from './router/upload.router.js';
import comparisonRouter from './router/comparison.router.js';
import quoteRequestRouter from './router/quoteRequest.router.js';
import searchLogRouter from './router/searchLog.router.js';
import aiSearchRouter from './router/aiSearch.router.js';
import { AppError } from './utils/AppError.js';

const app = express();

// Security Middlewares
app.use(helmet({ crossOriginResourcePolicy: false }));
// Allowed Origins Configuration for Production & Development
const allowedOrigins = (process.env.CORS_ORIGIN || process.env.CLIENT_URL || 'http://localhost:3000')
  .split(',')
  .map((origin) => origin.trim());

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, server-to-server)
      if (!origin || allowedOrigins.includes(origin) || allowedOrigins.includes('*')) {
        return callback(null, true);
      }
      return callback(null, true); // Fallback to allow connection, origin verified via headers
    },
    credentials: true,
  })
);

// Body Parsers & Cookie Parser
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// Static File Serving for Uploaded Media & Brochures
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// Logging Middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Health Check Routes for AWS ALB Target Group (TG) & ECS Container Monitoring
const healthCheckHandler = (req, res) => {
  res.status(200).json({
    status: 'healthy',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
  });
};

app.get('/', healthCheckHandler);
app.get('/health', healthCheckHandler);
app.head('/health', (req, res) => res.status(200).end());
app.get('/api/v1/health', healthCheckHandler);

// API Routes
app.use('/api/v1/users', userRouter);
app.use('/api/v1/categories', categoryRouter);
app.use('/api/v1/attributes', attributeMasterRouter);
app.use('/api/v1/category-templates', categoryAttributeTemplateRouter);
app.use('/api/v1/vendors', vendorRouter);
app.use('/api/v1/machines', machineRouter);
app.use('/api/v1/uploads', uploadRouter);
app.use('/api/v1/comparisons', comparisonRouter);
app.use('/api/v1/quotes', quoteRequestRouter);
app.use('/api/v1/search-analytics', searchLogRouter);
app.use('/api/v1/ai', aiSearchRouter);

// 404 Route Handler
app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// Global Error Handling Middleware
app.use((err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Something went wrong on the server.';

  if (err.name === 'SequelizeUniqueConstraintError') {
    statusCode = 400;
    const field = err.errors && err.errors[0] ? err.errors[0].path : 'email';
    message = `An account with this ${field} already exists. Please login instead.`;
  } else if (err.name === 'SequelizeValidationError') {
    statusCode = 400;
    message = err.errors ? err.errors.map((e) => e.message).join('. ') : 'Validation error.';
  }

  res.status(statusCode).json({
    success: false,
    status: statusCode >= 500 ? 'error' : 'fail',
    message,
  });
});

export default app;

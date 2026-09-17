import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { config } from './config/env';
import { errorHandler } from './middleware/error.middleware';
import { sendError } from './utils/apiResponse';

// Import route modules
import authRoutes from './routes/auth.routes';
import bankRoutes from './routes/bank.routes';
import loanSchemeRoutes from './routes/loanScheme.routes';
import documentRoutes from './routes/document.routes';
import governmentSchemeRoutes from './routes/governmentScheme.routes';
import institutionRoutes from './routes/institution.routes';
import applicationRoutes from './routes/application.routes';
import sourceRoutes from './routes/source.routes';
import faqRoutes from './routes/faq.routes';
import adminRoutes from './routes/admin.routes';
import loanFinderRoutes from './routes/loanFinder.routes';
import calculatorRoutes from './routes/calculator.routes';
import searchRoutes from './routes/search.routes';

const app = express();

// Security headers
app.use(helmet());

// CORS configuration
const configuredOrigins = config.FRONTEND_URL
  ? config.FRONTEND_URL.split(',').map((u) => u.trim())
  : [];
const allowedOrigins = Array.from(
  new Set([...configuredOrigins, 'http://localhost:5173', 'http://127.0.0.1:5173'])
);

app.use(
  cors({
    origin: allowedOrigins.includes('*') ? '*' : allowedOrigins,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// Body parser
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

// Development request logger
if (config.NODE_ENV === 'development') {
  app.use((req: Request, res: Response, next: NextFunction) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
  });
}

// Health check endpoint (As specifically required)
app.get('/api/health', (req: Request, res: Response) => {
  res.status(200).json({
    status: 'ok',
    service: 'Edu4Loan API',
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/banks', bankRoutes);
app.use('/api/loan-schemes', loanSchemeRoutes);
app.use('/api/documents', documentRoutes);
app.use('/api/government-schemes', governmentSchemeRoutes);
app.use('/api/institutions', institutionRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/sources', sourceRoutes);
app.use('/api/faqs', faqRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/loan-finder', loanFinderRoutes);
app.use('/api/calculator', calculatorRoutes);
app.use('/api/search', searchRoutes);

// 404 Route Handler
app.use((req: Request, res: Response) => {
  sendError(res, 404, 'ROUTE_NOT_FOUND', `Cannot ${req.method} ${req.originalUrl}`);
});

// Centralized Error Handler
app.use(errorHandler);

export default app;

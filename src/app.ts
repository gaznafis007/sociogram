import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import connectDB from './config/database';
import { initializeFirebase } from './config/firebase';
import { swaggerSpec } from './config/swagger';
import authRoutes from './routes/auth.routes';
import postRoutes from './routes/post.routes';
import { errorHandler } from './middleware/error.middleware';
import { ResponseHandler } from './utils/response';
import { logger } from './utils/logger';

const app: Express = express();

// Middleware
const allowedOrigin = process.env.API_URL || 'http://localhost:19006';
const corsOptions = {
  origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
    // Allow requests with no origin (e.g., mobile apps, curl)
    if (!origin) return callback(null, true);
    if (origin === allowedOrigin || process.env.NODE_ENV === 'development') {
      return callback(null, true);
    }
    return callback(new Error('CORS policy: This origin is not allowed'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'X-Requested-With'],
  exposedHeaders: ['Authorization'],
  maxAge: 86400,
};

app.use(cors(corsOptions));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Initialize Firebase
initializeFirebase();

// Connect to Database
connectDB();

// API Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, { customCss: '', customCssUrl: '' }));

// Health check
app.get('/health', (req: Request, res: Response) => {
  ResponseHandler.success(res, { status: 'OK' }, 'Server is running');
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);

// 404 handler
app.use((req: Request, res: Response) => {
  ResponseHandler.error(res, 'Route not found', 404);
});

// Error handling middleware (must be last)
app.use(errorHandler);

export default app;

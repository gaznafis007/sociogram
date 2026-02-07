/**
 * Project Configuration
 * Centralized configuration for the entire application
 */

export interface AppConfig {
  port: number;
  nodeEnv: 'development' | 'production' | 'test';
  apiUrl: string;
  database: {
    url: string;
  };
  jwt: {
    secret: string;
    expiration: string;
  };
  firebase: {
    serviceAccount?: string;
    projectId?: string;
    privateKey?: string;
    clientEmail?: string;
  };
}

const config: AppConfig = {
  port: parseInt(process.env.PORT || '5000', 10),
  nodeEnv: (process.env.NODE_ENV as 'development' | 'production' | 'test') || 'development',
  apiUrl: process.env.API_URL || 'http://localhost:5000',
  database: {
    url: process.env.DB_URL || 'mongodb://localhost:27017/sociogram',
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'dev-secret-key-change-in-production',
    expiration: process.env.JWT_EXPIRATION || '7d',
  },
  firebase: {
    serviceAccount: process.env.FIREBASE_SERVICE_ACCOUNT,
    projectId: process.env.FIREBASE_PROJECT_ID,
    privateKey: process.env.FIREBASE_PRIVATE_KEY,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  },
};

export default config;

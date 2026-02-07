import admin from 'firebase-admin';
import { logger } from '../utils/logger';

const initializeFirebase = (): void => {
  try {
    // Firebase is initialized with environment variables
    // Make sure to set FIREBASE_* env vars or use firebase-key.json
    
    if (!admin.apps.length) {
      const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT 
        ? JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT)
        : undefined;

      if (serviceAccount) {
        admin.initializeApp({
          credential: admin.credential.cert(serviceAccount),
        });
      } else {
        // Use default credentials from environment
        admin.initializeApp();
      }
    }
    
    logger.info('✓ Firebase Initialized Successfully');
  } catch (error) {
    logger.error('Firebase Initialization Failed:', error);
    throw error;
  }
};

export { admin, initializeFirebase };

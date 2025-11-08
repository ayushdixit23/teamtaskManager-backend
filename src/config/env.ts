import dotenv from 'dotenv';

dotenv.config();

/**
 * Validates that required environment variables are present
 * @param key - The environment variable key
 * @param defaultValue - Optional default value
 * @returns The environment variable value or default
 */
const getEnvVariable = (key: string, defaultValue: string = ""): string => {
  const value = process.env[key] || defaultValue;
  
  if (!value) {
    throw new Error(`Environment variable ${key} is required but not defined`);
  }
  
  return value;
};

// Environment Configuration
export const PORT = getEnvVariable('PORT','5001');
export const NODE_ENV = getEnvVariable('NODE_ENV','development');

// Database Configuration
export const DATABASE_URL = getEnvVariable('DATABASE_URL','postgresql://postgres:postgres@localhost:5432/postgres');

// CORS Configuration
export const ALLOWED_ORIGINS = getEnvVariable('ALLOWED_ORIGINS','http://localhost:3000,http://localhost:3001').split(',');

// Rate Limiting Configuration
export const RATE_LIMIT_WINDOW_MS = parseInt(getEnvVariable('RATE_LIMIT_WINDOW_MS','900000'), 10); // 15 minutes
export const RATE_LIMIT_MAX_REQUESTS = parseInt(getEnvVariable('RATE_LIMIT_MAX_REQUESTS','400'), 10);


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

// JWT Configuration
export const JWT_SECRET = getEnvVariable('JWT_SECRET','secret');
export const JWT_ACCESS_TOKEN_EXPIRY = getEnvVariable('JWT_ACCESS_TOKEN_EXPIRY','3h');
export const JWT_REFRESH_TOKEN_EXPIRY = getEnvVariable('JWT_REFRESH_TOKEN_EXPIRY','7d');

/**
 * Converts JWT expiry string (e.g., "7d", "3h", "30m") to milliseconds
 * @param expiresIn - JWT expiry string format (e.g., "7d", "3h", "30m", "60s")
 * @returns Milliseconds equivalent
 */
const expiryToMilliseconds = (expiresIn: string): number => {
  const match = expiresIn.match(/^(\d+)([smhd])$/);
  if (!match) {
    throw new Error(`Invalid expiry format: ${expiresIn}. Expected format: number followed by s/m/h/d`);
  }

  const value = parseInt(match[1], 10);
  const unit = match[2];

  const multipliers: Record<string, number> = {
    s: 1000,           // seconds
    m: 1000 * 60,      // minutes
    h: 1000 * 60 * 60, // hours
    d: 1000 * 60 * 60 * 24, // days
  };

  return value * multipliers[unit];
};

export const JWT_REFRESH_TOKEN_EXPIRY_MS = expiryToMilliseconds(JWT_REFRESH_TOKEN_EXPIRY);
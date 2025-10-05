// ExoAI Explorer Backend Configuration
module.exports = {
    // Server Configuration
    PORT: process.env.PORT || 3000,
    NODE_ENV: process.env.NODE_ENV || 'development',
    
    // Frontend URL (for CORS)
    FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:8005',
    
    // JWT Secret (change this in production!)
    JWT_SECRET: process.env.JWT_SECRET || 'exoai-explorer-super-secret-jwt-key-2024-change-in-production',
    
    // Database Configuration
    DB_PATH: process.env.DB_PATH || './db/users.db',
    
    // Session Configuration
    SESSION_SECRET: process.env.SESSION_SECRET || 'exoai-explorer-session-secret-2024',
    
    // Security Settings
    BCRYPT_ROUNDS: parseInt(process.env.BCRYPT_ROUNDS) || 12,
    RATE_LIMIT_WINDOW_MS: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 900000, // 15 minutes
    RATE_LIMIT_MAX_REQUESTS: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
    
    // JWT Token Expiration
    JWT_EXPIRES_IN: '24h',
    
    // Session Configuration
    SESSION_MAX_AGE: 24 * 60 * 60 * 1000, // 24 hours
};

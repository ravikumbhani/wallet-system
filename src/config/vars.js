require('dotenv').config();

module.exports = {
    env: process.env.NODE_ENV || 'development',
    port: process.env.PORT || 3000,

    // MongoDB
    mongoURI: process.env.MONGODB_URI || 'mongodb://localhost:27017/wallet-system',

    // JWT
    jwtSecret: process.env.JWT_SECRET || 'your-secret-key',
    jwtExpiration: process.env.JWT_EXPIRATION || '86400', // Default: 1 day

    // Email (SMTP)
    smtp: {
        host: process.env.SMTP_HOST || 'smtp.gmail.com',
        port: process.env.SMTP_PORT || 587,
        user: process.env.SMTP_USERNAME || 'your-email@gmail.com',
        pass: process.env.SMTP_PASSWORD || 'your-app-password',
        from: process.env.EMAIL_FROM || 'your-email@gmail.com',
    },
};

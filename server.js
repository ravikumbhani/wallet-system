require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');
const routes = require('./src/routes');
const { errorHandler, notFound } = require('./src/middlewares/error');
const logger = require('./src/config/logger');
const { port, mongoURI } = require('./src/config/vars');

const app = express();

// Security middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('combined', { stream: logger.stream }));

// API routes
app.use('/api/v1', routes);

// Handle 404 errors
app.use(notFound);

// Global error handler
app.use(errorHandler);

// Connect to MongoDB and start server
mongoose
    .connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        logger.info('Connected to MongoDB');
        app.listen(port, () => {
            logger.info(`Server running on port ${port}`);
        });
    })
    .catch((error) => {
        logger.error('MongoDB connection error:', error);
        process.exit(1);
    });

module.exports = app;

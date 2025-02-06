const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');
const routes = require('./routes');
const { errorHandler, notFound } = require('./middlewares/error');
const logger = require('./config/logger');

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

module.exports = app;

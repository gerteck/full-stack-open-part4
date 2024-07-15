const blogsRouter = require('./controllers/blogs');
const cors = require('cors');
const config = require('./utils/config');
const express = require('express');
const middleware = require('./utils/middleware');
const logger = require('./utils/logger');
const mongoose = require('mongoose');

const app = express();

mongoose.set('strictQuery', false);
logger.info('connecting to', config.MONGODB_URL);

// Connect to MongoDB
const mongoUrl = config.MONGODB_URL;
mongoose.connect(mongoUrl).then(() => {
    logger.info('connected to MongoDB');
}).catch((error) => {
    logger.error('error connecting to MongoDB:', error.message);
});

// Set up the Router Controller
app.use(cors());
app.use(express.json());
app.use('/api/blogs', blogsRouter);

// Set up Middleware
app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

module.exports = app;

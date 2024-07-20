const logger = require('./logger');
const jwt = require('jsonwebtoken');
const config = require('./config');

const User = require('../models/user');

const requestLogger = (request, _response, next) => {
    logger.info('Method:', request.method);
    logger.info('Path:  ', request.path);
    logger.info('Body:  ', request.body);
    logger.info('---');
    next();
};

const unknownEndpoint = (_request, response) => {
    response.status(404).send({ error: 'unknown endpoint' });
};

const errorHandler = (error, _request, response, next) => {
    logger.error(error.message);

    if (error.name === 'CastError') {
        return response.status(400).send({ error: 'malformatted id' });
    } else if (error.name === 'ValidationError') {
        return response.status(400).json({ error: error.message });
    } else if (error.name === 'MongoServerError' && error.message.includes('E11000 duplicate key error')) {
        return response.status(400).json({ error: 'expected `username` to be unique' })
    } else if (error.name ===  'JsonWebTokenError') {
        return response.status(401).json({ error: 'token invalid' });
    } else if (error.name === 'TokenExpiredError') {
        return response.status(401).json({ error: 'token expired' });
    }

    next(error);
};

const tokenExtractor = (request, _response, next) => {
    const authorization = request.get('authorization');
    if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
        request.token = authorization.substring(7);
    } else {
        request.token = null;
    }
    next();
}

const userExtractor = async (request, response, next) => {
    const token = request.token;

    if (!token) {
        response.status(401).json({ error: 'token missing' });
    }

    // TODO add if token not provided ? Probably in token Extract

    if (token) {
        const decodedToken = jwt.verify(token, config.TOKEN_SECRET);
        const user = await User.findById(decodedToken.id);
        // Need to return the User Mongoose Object
        request.user = user;
    }

    next();
}

module.exports = {
    requestLogger,
    unknownEndpoint,
    errorHandler,
    tokenExtractor,
    userExtractor,
};

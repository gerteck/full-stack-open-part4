const jwt = require('jsonwebtoken');
const config = require('../utils/config');
const bcrypt = require('bcrypt');
const loginRouter = require('express').Router();
const User = require('../models/user');
require('express-async-errors');

loginRouter.post('/', async (request, response) => {
    const { username, password } = request.body;

    const user = await User.findOne({ username });
    const passwordCorrect =
        user === null
            ? false
            : await bcrypt.compare(password, user.passwordHash);

    // login compares the password to the hash stored in the database
    if (!(user && passwordCorrect)) {
        // 401 Unauthorized
        return response.status(401).json({
            error: 'invalid username or password',
        });
    }

    const userForToken = {
        username: user.username,
        id: user._id,
    };

    const token = jwt.sign(userForToken, config.TOKEN_SECRET, {
        expiresIn: 60 * 60 * 2,
    });

    response
        .status(200)
        .send({ token, username: user.username, name: user.name });
});

module.exports = loginRouter;

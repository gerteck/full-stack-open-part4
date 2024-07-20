const jwt = require('jsonwebtoken');

const config = require('../utils/config');
const User = require('../models/user');

const initialBlogs = (user) => [
    {
        "title": "New Test Blog 1",
        "author": user.name,
        "url": "https://gerteck.github.io",
        "likes": 999,
        "user": user._id || user.id,
    },
    {
        "title": "New Test Blog 2",
        "author": user.name,
        "url": "https://gerteck.github.io",
        "likes": 888,
        "user": user._id || user.id,
    },
];


const usersInDb = async () => {
    const users = await User.find({});
    return users.map((u) => u.toJSON());
};

const getToken = (username, id) => {
    const userForToken = {
        username,
        id,
    };
    return jwt.sign(userForToken, config.TOKEN_SECRET, {
        expiresIn: 60 * 60 * 2,
    });
};

module.exports = {
    initialBlogs,
    usersInDb,
    getToken,
};
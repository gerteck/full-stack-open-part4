const User = require('../models/user')

const initialBlogs = [
    {
        "title": "New Test Blog 1",
        "author": "Ger Teck",
        "url": "https://gerteck.github.io",
        "likes": 999
    },
    {
        "title": "New Test Blog 2",
        "author": "Ger Teck",
        "url": "https://gerteck.github.io",
        "likes": 999
    }
];

const usersInDb = async () => {
    const users = await User.find({});
    return users.map((u) => u.toJSON());
};

module.exports = {
    initialBlogs,
    usersInDb,
};
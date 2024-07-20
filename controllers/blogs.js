// This file contains the controller functions for the blogs routes.
const blogsRouter = require('express').Router();
const Blog = require('../models/blog');
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const config = require('../utils/config');
require('express-async-errors');

blogsRouter.get('/', async (_request, response, _next) => {
    const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 });

    // use populate
    response.json(blogs);
});

blogsRouter.post('/', async (request, response, _next) => {
    const body = request.body;

    // Decodes token, returns Object token was based on
    // Token Object only has id field and username
    const decodedToken = jwt.verify(request.token, config.TOKEN_SECRET);
    if (!decodedToken.id) {
        return response.status(401).json({ error: 'token invalid' });
    }
    const user = await User.findById(decodedToken.id);


    const blog = new Blog({
        title: body.title,
        author: user.name,
        url: body.url,
        likes: body.likes,
        user: user._id,
    });


    if (!blog.title && !blog.url) {
        return response.status(400).json({ error: 'title and url missing' });
    }

    if (!blog.likes) {
        blog.likes = 0;
    }

    const savedBlog = await blog.save();
    user.blogs = user.blogs.concat(savedBlog._id);
    await user.save();
    response.status(201).json(savedBlog);
});

blogsRouter.delete('/:id', async (request, response, _next) => {
    await Blog.findByIdAndDelete(request.params.id);
    response.status(204).end();
});

blogsRouter.put('/:id', async (request, response, _next) => {
    const body = request.body;

    const updatedBlog = {
        title: body.title,
        likes: body.likes,
        author: body.author,
        url: body.url,
    };

    // { new: true } returns the modified document rather than the original
    const returnedBlog = await Blog.findByIdAndUpdate(
        request.params.id,
        updatedBlog,
        { new: true }
    );
    response.json(returnedBlog);
});

module.exports = blogsRouter;

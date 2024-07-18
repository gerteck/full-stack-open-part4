// This file contains the controller functions for the blogs routes.
const blogsRouter = require('express').Router();
const Blog = require('../models/blog');

blogsRouter.get('/', async (_request, response, next) => {
    try {
        const blogs = await Blog.find({});
        response.json(blogs);
    } catch (error) {
        next(error);
    }
});

blogsRouter.post('/', async (request, response, next) => {
    try {
        const blog = new Blog(request.body);

        if (!blog.title && !blog.url) {
            return response.status(400).json({ error: 'title and url missing' });
        }

        if (!blog.likes) {
            blog.likes = 0;
        }

        const result = await blog.save();
        response.status(201).json(result);
    } catch (error) {
        next(error);
    }
});

module.exports = blogsRouter;
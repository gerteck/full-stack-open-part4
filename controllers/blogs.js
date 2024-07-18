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

blogsRouter.delete('/:id', async (request, response, next) => {
    try {
        await Blog.findByIdAndDelete(request.params.id);
        response.status(204).end();
    } catch (error) {
        next(error);
    }
});

blogsRouter.put('/:id', async (request, response, next) => {
    const body = request.body;

    const updatedBlog = {
        title: body.title,
        likes: body.likes,
        author: body.author,
        url: body.url,
    };

    try {
        // { new: true } returns the modified document rather than the original
        const returnedBlog = await Blog.findByIdAndUpdate(request.params.id, updatedBlog, { new: true });
        response.json(returnedBlog);
    } catch (error) {
        next(error);
    }
});

module.exports = blogsRouter;
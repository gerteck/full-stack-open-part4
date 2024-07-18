// This file contains the controller functions for the blogs routes.
const blogsRouter = require('express').Router();
const Blog = require('../models/blog');
require('express-async-errors');

blogsRouter.get('/', async (_request, response, _next) => {
    const blogs = await Blog.find({});
    response.json(blogs);
});

blogsRouter.post('/', async (request, response, _next) => {
    const blog = new Blog(request.body);

    if (!blog.title && !blog.url) {
        return response.status(400).json({ error: 'title and url missing' });
    }

    if (!blog.likes) {
        blog.likes = 0;
    }

    const result = await blog.save();
    response.status(201).json(result);
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

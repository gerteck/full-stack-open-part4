// This file contains the controller functions for the blogs routes.
const blogsRouter = require('express').Router();
const Blog = require('../models/blog');
const middleware = require('../utils/middleware');
require('express-async-errors');

blogsRouter.get('/', async (_request, response, _next) => {
    const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 });

    // use populate
    response.json(blogs);
});

blogsRouter.post('/', middleware.userExtractor, async (request, response, _next) => {
    const body = request.body;

    // Token handled by middleware
    const user = request.user;

    const blog = new Blog({
        title: body.title,
        author: user.name,
        url: body.url,
        likes: body.likes,
        user: user.id,
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

blogsRouter.delete('/:id', middleware.userExtractor, async (request, response, _next) => {

    const user = request.user;
    if (!user) {
        return;
    }

    const blog = await Blog.findById(request.params.id);

    if (blog.user.toString() !== user.id.toString()) {
        return response.status(401).json({ error: 'unauthorized' });
    }

    await Blog.findByIdAndDelete(request.params.id);
    user.blog = user.blogs.filter((blog) => blog.id.toString() !== request.params.id.toString());
    await user.save();

    response.status(204).end();
});

blogsRouter.put('/:id', async (request, response, _next) => {
    const body = request.body;

    const blog = await Blog.findById(request.params.id);

    const updatedBlog = {
        title: body.title || blog.title,
        likes: body.likes || blog.likes,
        author: body.author || blog.author,
        url: body.url || blog.url,
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

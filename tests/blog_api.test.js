const { test, describe, after, beforeEach } = require('node:test');
const assert = require('node:assert');
const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');
const Blog = require('../models/blog');

const helper = require('./test_helper');

// wrap the app in a superagent object
const api = supertest(app);


beforeEach(async () => {
    await Blog.deleteMany({});
    let blogObject = new Blog(helper.initialiBlogs[0]);
    await blogObject.save()
    blogObject = new Blog(helper.initialiBlogs[1])
    await blogObject.save()
});

console.log('\n\nBlog_API Tests:');

describe('Test Blog APIs', () => {

    test('notes are returned as json', async () => {
        await api
            .get('/api/blogs')
            .expect(200)
            .expect('Content-Type', /application\/json/);
    });

    test('there are two blogs', async () => {
        const response = await api.get('/api/blogs');

        assert.strictEqual(response.body.length, 2);
    });

    test('the first blog title is correct', async () => {
        const response = await api.get('/api/blogs');
        assert.strictEqual(response.body[0].title, 'New Test Blog 1');
    });

    test('Unique identifier property of the blog posts is named id', async () => {
        const response = await api.get('/api/blogs');
        assert(response.body[0].id);
    });

    test('A valid blog can be added, total number increases by 1', async () => {
        const newBlog = {
            "title": 'New Test Blog Added',
            "author": "Ger Teck",
            "url": "https://gerteck.github.io",
            "likes": 999
        };
        await api
            .post('/api/blogs')
            .send(newBlog)
            .expect(201)
            .expect('Content-Type', /application\/json/);

        const newBlogs = await api.get('/api/blogs');
        const newTotalBlogs = newBlogs.body.length;
        assert.strictEqual(newTotalBlogs, 3);
    });

    test('A blog without likes property defaults to 0', async () => {
        const newBlog = {
            "title": 'New Test Blog No Likes',
            "author": "Ger Teck",
            "url": "https://gerteck.github.io"
        };
        const response = await api
            .post('/api/blogs')
            .send(newBlog)
            .expect(201)
            .expect('Content-Type', /application\/json/);

        assert.strictEqual(response.body.likes, 0);
    });

    test('A blog without title and url properties returns 400', async () => {
        const newBlog = {
            "author": "Ger Teck",
            "likes": 999
        };
        await api
            .post('/api/blogs')
            .send(newBlog)
            .expect(400);
    });

    test('A blog can be deleted', async () => {
        const blogs = await api.get('/api/blogs');
        const blogToDelete = blogs.body[0];

        await api
            .delete(`/api/blogs/${blogToDelete.id}`)
            .expect(204);

        const newBlogs = await api.get('/api/blogs');
        const newTotalBlogs = newBlogs.body.length;
        assert.strictEqual(newTotalBlogs, 1);
    });

    test('A blog can be updated', async () => {
        const blogs = await api.get('/api/blogs');
        const blogToUpdate = blogs.body[0];
        const updatedBlog = { ...blogToUpdate, likes: 1000 };

        await api
            .put(`/api/blogs/${blogToUpdate.id}`)
            .send(updatedBlog)
            .expect(200);

        const newBlogs = await api.get('/api/blogs');
        const updatedBlogLikes = newBlogs.body[0].likes;
        assert.strictEqual(updatedBlogLikes, 1000);
    });

});

// test.only('Test this only', async () => {
//     assert(true);
// });



after(async () => {
    await mongoose.connection.close();
});

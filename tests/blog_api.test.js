const { test, describe, after } = require('node:test');
const assert = require('node:assert');
const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');

// wrap the app in a superagent object
const api = supertest(app);

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

        const titles = response.body.map((e) => e.title);
        assert.strictEqual(titles.includes('New Test Blog 2'), true);
    });

    test('Unique identifier property of the blog posts is named id', async () => {
        const response = await api.get('/api/blogs');
        assert(response.body[0].id);
    });

    test('A valid blog can be added, total number increases by 1', async () => {
        const oldBlogs = await api.get('/api/blogs');
        const totalBlogs = oldBlogs.body.length;

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
        assert.strictEqual(newTotalBlogs, totalBlogs + 1);
    });
});


after(async () => {
    await mongoose.connection.close();
});

const { test, after } = require('node:test');
const assert = require('node:assert');
const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');

// wrap the app in a superagent object
const api = supertest(app);

console.log('\n\nBlog_API Tests:');

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

after(async () => {
    await mongoose.connection.close();
});

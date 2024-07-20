const { test, describe, after, beforeEach } = require('node:test');
const assert = require('node:assert');
const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');
const helper = require('./test_helper');
const User = require('../models/user');

const api = supertest(app);

console.log('\nUser_API Tests:');

let _globalTestUser;

describe('when there is initially one user in db', () => {
    beforeEach(async () => {
        await User.deleteMany({});

        const testUser = {
            username: 'testUserRouterUser',
            name: 'Test User',
            password: 'sekret',
        };
        const response = await api.post('/api/users').send(testUser);
        _globalTestUser = await User.findById(response.body.id);

    });

    test('creation succeeds with a fresh username', async () => {
        const usersAtStart = await helper.usersInDb();

        const newUser = {
            username: 'gttest',
            name: 'Ger Teck',
            password: 'greygoose',
        };

        await api
            .post('/api/users')
            .send(newUser)
            .expect(201)
            .expect('Content-Type', /application\/json/);

        const usersAtEnd = await helper.usersInDb();
        assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1);

        const usernames = usersAtEnd.map((u) => u.username);
        assert(usernames.includes(newUser.username));
    });

    test('creation fails with proper statuscode and message if username already taken', async () => {
        const usersAtStart = await helper.usersInDb();

        const newUser = {
            username: 'testUserRouterUser',
            name: 'doesntmatter',
            password: 'doesntmatter',
        };

        const result = await api
            .post('/api/users')
            .send(newUser)
            .expect(400)
            .expect('Content-Type', /application\/json/);

        const usersAtEnd = await helper.usersInDb();
        assert(result.body.error.includes('expected `username` to be unique'));

        assert.strictEqual(usersAtEnd.length, usersAtStart.length);
    });

    test('creation fails with proper statuscode and message if username is too short', async () => {
        const usersAtStart = await helper.usersInDb();

        const newUser = {
            username: 'gt',
            name: 'Superuser',
            password: 'doesntmatter',
        };

        const result = await api
            .post('/api/users')
            .send(newUser)
            .expect(400)
            .expect('Content-Type', /application\/json/);

        const usersAtEnd = await helper.usersInDb();
        assert(result.body.error.includes('shorter than the minimum allowed length (3)'));

        assert.strictEqual(usersAtEnd.length, usersAtStart.length);
    });
});





after(async () => {
    await mongoose.connection.close();
});



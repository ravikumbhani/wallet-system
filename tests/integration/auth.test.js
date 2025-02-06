const request = require('supertest');
const httpStatus = require('http-status');
const app = require('../../server');
const { User } = require('../../src/models');
const { setupTestDB } = require('../utils/setupTestDB');
const { userOne, admin, insertUsers } = require('../fixtures/user.fixture');
const { userAccessToken, adminAccessToken } = require('../fixtures/token.fixture');

setupTestDB();

describe('Authentication API', () => {
    describe('POST /v1/auth/register', () => {
        it('should register a new user successfully', async () => {
            const newUser = {
                name: 'Test User',
                email: 'test@example.com',
                password: 'Password123!',
            };

            const res = await request(app).post('/v1/auth/register').send(newUser);

            expect(res.status).toBe(httpStatus.CREATED);
            expect(res.body).toHaveProperty('user');
            expect(res.body.user).toHaveProperty('email', newUser.email);
        });

        it('should return 400 for duplicate email', async () => {
            await insertUsers([userOne]);

            const res = await request(app).post('/v1/auth/register').send({
                name: 'User One',
                email: userOne.email,
                password: 'Password123!',
            });

            expect(res.status).toBe(httpStatus.BAD_REQUEST);
            expect(res.body).toHaveProperty('message', 'Email already in use');
        });
    });

    describe('POST /v1/auth/login', () => {
        it('should login successfully with valid credentials', async () => {
            await insertUsers([userOne]);

            const res = await request(app).post('/v1/auth/login').send({
                email: userOne.email,
                password: 'password123',
            });

            expect(res.status).toBe(httpStatus.OK);
            expect(res.body).toHaveProperty('tokens');
            expect(res.body.tokens).toHaveProperty('access');
            expect(res.body.tokens.access).toHaveProperty('token');
        });

        it('should return 401 for incorrect credentials', async () => {
            await insertUsers([userOne]);

            const res = await request(app).post('/v1/auth/login').send({
                email: userOne.email,
                password: 'wrongpassword',
            });

            expect(res.status).toBe(httpStatus.UNAUTHORIZED);
            expect(res.body).toHaveProperty('message', 'Incorrect email or password');
        });
    });

    describe('POST /v1/auth/logout', () => {
        it('should logout successfully with a valid token', async () => {
            const res = await request(app)
                .post('/v1/auth/logout')
                .set('Authorization', `Bearer ${userAccessToken}`)
                .send();

            expect(res.status).toBe(httpStatus.NO_CONTENT);
        });

        it('should return 401 if token is missing', async () => {
            const res = await request(app).post('/v1/auth/logout').send();

            expect(res.status).toBe(httpStatus.UNAUTHORIZED);
            expect(res.body).toHaveProperty('message', 'Unauthorized');
        });
    });

    describe('POST /v1/auth/refresh-tokens', () => {
        it('should refresh access token with valid refresh token', async () => {
            const res = await request(app)
                .post('/v1/auth/refresh-tokens')
                .send({ refreshToken: userAccessToken });

            expect(res.status).toBe(httpStatus.OK);
            expect(res.body).toHaveProperty('tokens');
            expect(res.body.tokens).toHaveProperty('access');
        });

        it('should return 401 for invalid refresh token', async () => {
            const res = await request(app)
                .post('/v1/auth/refresh-tokens')
                .send({ refreshToken: 'invalidtoken' });

            expect(res.status).toBe(httpStatus.UNAUTHORIZED);
            expect(res.body).toHaveProperty('message', 'Invalid refresh token');
        });
    });
});


// npm test
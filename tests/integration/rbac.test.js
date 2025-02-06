const request = require('supertest');
const httpStatus = require('http-status');
const app = require('../../server');
const { insertUsers, adminUser, userOne } = require('../fixtures/user.fixture');
const { adminAccessToken, userAccessToken } = require('../fixtures/token.fixture');
const { setupTestDB } = require('../utils/setupTestDB');

setupTestDB();

describe('RBAC (Role-Based Access Control) API', () => {
    describe('Admin-Only Access', () => {
        it('should allow an admin to access a protected route', async () => {
            await insertUsers([adminUser]);

            const res = await request(app)
                .get('/v1/admin/protected')
                .set('Authorization', `Bearer ${adminAccessToken}`)
                .send();

            expect(res.status).toBe(httpStatus.OK);
            expect(res.body).toHaveProperty('message', 'Access granted');
        });

        it('should return 403 if a non-admin user tries to access an admin route', async () => {
            await insertUsers([userOne]);

            const res = await request(app)
                .get('/v1/admin/protected')
                .set('Authorization', `Bearer ${userAccessToken}`)
                .send();

            expect(res.status).toBe(httpStatus.FORBIDDEN);
            expect(res.body).toHaveProperty('message', 'Forbidden');
        });

        it('should return 401 if no token is provided', async () => {
            const res = await request(app).get('/v1/admin/protected').send();

            expect(res.status).toBe(httpStatus.UNAUTHORIZED);
            expect(res.body).toHaveProperty('message', 'Unauthorized');
        });
    });

    describe('User Access', () => {
        it('should allow a regular user to access a standard route', async () => {
            await insertUsers([userOne]);

            const res = await request(app)
                .get('/v1/user/profile')
                .set('Authorization', `Bearer ${userAccessToken}`)
                .send();

            expect(res.status).toBe(httpStatus.OK);
            expect(res.body).toHaveProperty('message', 'User profile data');
        });

        it('should return 401 if an unauthenticated user tries to access a protected route', async () => {
            const res = await request(app).get('/v1/user/profile').send();

            expect(res.status).toBe(httpStatus.UNAUTHORIZED);
            expect(res.body).toHaveProperty('message', 'Unauthorized');
        });
    });
});


// npm test
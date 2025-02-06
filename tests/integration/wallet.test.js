const request = require('supertest');
const httpStatus = require('http-status');
const app = require('../../server');
const { Wallet } = require('../../src/models');
const { setupTestDB } = require('../utils/setupTestDB');
const { userOne, insertUsers } = require('../fixtures/user.fixture');
const { userAccessToken } = require('../fixtures/token.fixture');

setupTestDB();

describe('Wallet API', () => {
    describe('GET /v1/wallets', () => {
        it('should return user wallet details when authenticated', async () => {
            await insertUsers([userOne]);
            const wallet = await Wallet.create({ user: userOne._id, balance: 1000 });

            const res = await request(app)
                .get('/v1/wallets')
                .set('Authorization', `Bearer ${userAccessToken}`)
                .send();

            expect(res.status).toBe(httpStatus.OK);
            expect(res.body).toHaveProperty('wallet');
            expect(res.body.wallet.balance).toBe(wallet.balance);
        });

        it('should return 401 if user is not authenticated', async () => {
            const res = await request(app).get('/v1/wallets').send();

            expect(res.status).toBe(httpStatus.UNAUTHORIZED);
            expect(res.body).toHaveProperty('message', 'Unauthorized');
        });
    });

    describe('POST /v1/wallets/deposit', () => {
        it('should deposit amount into wallet successfully', async () => {
            await insertUsers([userOne]);
            await Wallet.create({ user: userOne._id, balance: 1000 });

            const depositAmount = 500;
            const res = await request(app)
                .post('/v1/wallets/deposit')
                .set('Authorization', `Bearer ${userAccessToken}`)
                .send({ amount: depositAmount });

            expect(res.status).toBe(httpStatus.OK);
            expect(res.body).toHaveProperty('wallet');
            expect(res.body.wallet.balance).toBe(1500);
        });

        it('should return 400 for invalid deposit amount', async () => {
            await insertUsers([userOne]);

            const res = await request(app)
                .post('/v1/wallets/deposit')
                .set('Authorization', `Bearer ${userAccessToken}`)
                .send({ amount: -100 });

            expect(res.status).toBe(httpStatus.BAD_REQUEST);
            expect(res.body).toHaveProperty('message', 'Deposit amount must be positive');
        });
    });

    describe('POST /v1/wallets/withdraw', () => {
        it('should withdraw amount from wallet successfully', async () => {
            await insertUsers([userOne]);
            await Wallet.create({ user: userOne._id, balance: 1000 });

            const withdrawAmount = 300;
            const res = await request(app)
                .post('/v1/wallets/withdraw')
                .set('Authorization', `Bearer ${userAccessToken}`)
                .send({ amount: withdrawAmount });

            expect(res.status).toBe(httpStatus.OK);
            expect(res.body).toHaveProperty('wallet');
            expect(res.body.wallet.balance).toBe(700);
        });

        it('should return 400 for insufficient funds', async () => {
            await insertUsers([userOne]);
            await Wallet.create({ user: userOne._id, balance: 100 });

            const res = await request(app)
                .post('/v1/wallets/withdraw')
                .set('Authorization', `Bearer ${userAccessToken}`)
                .send({ amount: 500 });

            expect(res.status).toBe(httpStatus.BAD_REQUEST);
            expect(res.body).toHaveProperty('message', 'Insufficient funds');
        });
    });
});


// npm test
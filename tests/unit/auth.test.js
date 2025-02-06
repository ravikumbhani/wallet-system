const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { AuthService } = require('../../src/services/auth.service');
const { User } = require('../../src/models/user.model');
const { config } = require('../../src/config/vars');

jest.mock('../../src/models/user.model');
jest.mock('bcryptjs');
jest.mock('jsonwebtoken');

describe('Auth Service', () => {
    describe('Login', () => {
        it('should return a valid token when credentials are correct', async () => {
            const mockUser = {
                id: 'userId123',
                email: 'test@example.com',
                password: 'hashedPassword',
                isAdmin: false,
            };

            User.findOne.mockResolvedValue(mockUser);
            bcrypt.compare.mockResolvedValue(true);
            jwt.sign.mockReturnValue('mockToken');

            const token = await AuthService.login('test@example.com', 'password123');

            expect(User.findOne).toHaveBeenCalledWith({ email: 'test@example.com' });
            expect(bcrypt.compare).toHaveBeenCalledWith('password123', mockUser.password);
            expect(jwt.sign).toHaveBeenCalledWith(
                { id: mockUser.id, email: mockUser.email, isAdmin: mockUser.isAdmin },
                config.jwt.secret,
                { expiresIn: config.jwt.expiration }
            );
            expect(token).toBe('mockToken');
        });

        it('should throw an error if the user is not found', async () => {
            User.findOne.mockResolvedValue(null);

            await expect(AuthService.login('nonexistent@example.com', 'password'))
                .rejects.toThrow('User not found');
        });

        it('should throw an error if the password is incorrect', async () => {
            const mockUser = { id: 'userId123', email: 'test@example.com', password: 'hashedPassword' };

            User.findOne.mockResolvedValue(mockUser);
            bcrypt.compare.mockResolvedValue(false);

            await expect(AuthService.login('test@example.com', 'wrongpassword'))
                .rejects.toThrow('Invalid credentials');
        });
    });

    describe('Register', () => {
        it('should create a new user and return a token', async () => {
            const mockUser = {
                id: 'newUserId',
                email: 'newuser@example.com',
                password: 'hashedPassword',
            };

            User.create.mockResolvedValue(mockUser);
            bcrypt.hash.mockResolvedValue('hashedPassword');
            jwt.sign.mockReturnValue('mockToken');

            const token = await AuthService.register('newuser@example.com', 'password123');

            expect(User.create).toHaveBeenCalledWith({
                email: 'newuser@example.com',
                password: 'hashedPassword',
            });
            expect(bcrypt.hash).toHaveBeenCalledWith('password123', 10);
            expect(jwt.sign).toHaveBeenCalledWith(
                { id: mockUser.id, email: mockUser.email },
                config.jwt.secret,
                { expiresIn: config.jwt.expiration }
            );
            expect(token).toBe('mockToken');
        });

        it('should throw an error if the email is already taken', async () => {
            User.findOne.mockResolvedValue(true);

            await expect(AuthService.register('existing@example.com', 'password'))
                .rejects.toThrow('Email is already in use');
        });
    });
});


// npm test
const { User } = require('../../src/models/user.model');
const { UserService } = require('../../src/services/user.service');
const bcrypt = require('bcryptjs');

jest.mock('../../src/models/user.model');
jest.mock('bcryptjs');

describe('User Service', () => {
    describe('Create User', () => {
        it('should create a new user successfully', async () => {
            const mockUser = { id: 'userId123', email: 'test@example.com', password: 'hashedPassword' };

            User.create.mockResolvedValue(mockUser);
            bcrypt.hash.mockResolvedValue('hashedPassword');

            const user = await UserService.createUser({ email: 'test@example.com', password: 'password123' });

            expect(User.create).toHaveBeenCalledWith({ email: 'test@example.com', password: 'hashedPassword' });
            expect(user).toEqual(mockUser);
        });

        it('should throw an error if user creation fails', async () => {
            User.create.mockRejectedValue(new Error('Database error'));

            await expect(UserService.createUser({ email: 'test@example.com', password: 'password123' }))
                .rejects.toThrow('Database error');
        });
    });

    describe('Get User by ID', () => {
        it('should return the user if found', async () => {
            const mockUser = { id: 'userId123', email: 'test@example.com' };

            User.findById.mockResolvedValue(mockUser);

            const user = await UserService.getUserById('userId123');

            expect(User.findById).toHaveBeenCalledWith('userId123');
            expect(user).toEqual(mockUser);
        });

        it('should return null if user is not found', async () => {
            User.findById.mockResolvedValue(null);

            const user = await UserService.getUserById('userId123');

            expect(user).toBeNull();
        });
    });

    describe('Get User by Email', () => {
        it('should return the user if found', async () => {
            const mockUser = { id: 'userId123', email: 'test@example.com' };

            User.findOne.mockResolvedValue(mockUser);

            const user = await UserService.getUserByEmail('test@example.com');

            expect(User.findOne).toHaveBeenCalledWith({ email: 'test@example.com' });
            expect(user).toEqual(mockUser);
        });

        it('should return null if user is not found', async () => {
            User.findOne.mockResolvedValue(null);

            const user = await UserService.getUserByEmail('test@example.com');

            expect(user).toBeNull();
        });
    });

    describe('Compare Passwords', () => {
        it('should return true if passwords match', async () => {
            bcrypt.compare.mockResolvedValue(true);

            const result = await UserService.comparePasswords('plainPassword', 'hashedPassword');

            expect(bcrypt.compare).toHaveBeenCalledWith('plainPassword', 'hashedPassword');
            expect(result).toBe(true);
        });

        it('should return false if passwords do not match', async () => {
            bcrypt.compare.mockResolvedValue(false);

            const result = await UserService.comparePasswords('wrongPassword', 'hashedPassword');

            expect(result).toBe(false);
        });
    });
});


// npm test
const { Wallet } = require('../../src/models/wallet.model');
const { WalletService } = require('../../src/services/wallet.service');

jest.mock('../../src/models/wallet.model');

describe('Wallet Service', () => {
    describe('Create Wallet', () => {
        it('should create a new wallet successfully', async () => {
            const mockWallet = { id: 'walletId123', user: 'userId123', balance: 0 };

            Wallet.create.mockResolvedValue(mockWallet);

            const wallet = await WalletService.createWallet('userId123');

            expect(Wallet.create).toHaveBeenCalledWith({ user: 'userId123', balance: 0 });
            expect(wallet).toEqual(mockWallet);
        });

        it('should throw an error if wallet creation fails', async () => {
            Wallet.create.mockRejectedValue(new Error('Database error'));

            await expect(WalletService.createWallet('userId123')).rejects.toThrow('Database error');
        });
    });

    describe('Get Wallet by User ID', () => {
        it('should return the user wallet if found', async () => {
            const mockWallet = { id: 'walletId123', user: 'userId123', balance: 100 };

            Wallet.findOne.mockResolvedValue(mockWallet);

            const wallet = await WalletService.getWalletByUserId('userId123');

            expect(Wallet.findOne).toHaveBeenCalledWith({ user: 'userId123' });
            expect(wallet).toEqual(mockWallet);
        });

        it('should return null if wallet is not found', async () => {
            Wallet.findOne.mockResolvedValue(null);

            const wallet = await WalletService.getWalletByUserId('userId123');

            expect(wallet).toBeNull();
        });
    });

    describe('Deposit Funds', () => {
        it('should increase wallet balance', async () => {
            const mockWallet = { id: 'walletId123', user: 'userId123', balance: 100, save: jest.fn() };

            Wallet.findOne.mockResolvedValue(mockWallet);

            const updatedWallet = await WalletService.depositFunds('userId123', 50);

            expect(mockWallet.balance).toBe(150);
            expect(mockWallet.save).toHaveBeenCalled();
            expect(updatedWallet).toEqual(mockWallet);
        });

        it('should throw an error if wallet is not found', async () => {
            Wallet.findOne.mockResolvedValue(null);

            await expect(WalletService.depositFunds('userId123', 50)).rejects.toThrow('Wallet not found');
        });
    });

    describe('Withdraw Funds', () => {
        it('should decrease wallet balance if funds are sufficient', async () => {
            const mockWallet = { id: 'walletId123', user: 'userId123', balance: 100, save: jest.fn() };

            Wallet.findOne.mockResolvedValue(mockWallet);

            const updatedWallet = await WalletService.withdrawFunds('userId123', 50);

            expect(mockWallet.balance).toBe(50);
            expect(mockWallet.save).toHaveBeenCalled();
            expect(updatedWallet).toEqual(mockWallet);
        });

        it('should throw an error if funds are insufficient', async () => {
            const mockWallet = { id: 'walletId123', user: 'userId123', balance: 30, save: jest.fn() };

            Wallet.findOne.mockResolvedValue(mockWallet);

            await expect(WalletService.withdrawFunds('userId123', 50))
                .rejects.toThrow('Insufficient balance');
        });

        it('should throw an error if wallet is not found', async () => {
            Wallet.findOne.mockResolvedValue(null);

            await expect(WalletService.withdrawFunds('userId123', 50)).rejects.toThrow('Wallet not found');
        });
    });
});


// npm test
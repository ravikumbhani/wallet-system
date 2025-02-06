module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('Transactions', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            walletId: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'Wallets',
                    key: 'id',
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE',
            },
            type: {
                type: Sequelize.ENUM('credit', 'debit'),
                allowNull: false,
            },
            amount: {
                type: Sequelize.DECIMAL(15, 2),
                allowNull: false,
            },
            status: {
                type: Sequelize.ENUM('pending', 'completed', 'failed'),
                allowNull: false,
                defaultValue: 'pending',
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
            },
        });
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('Transactions');
    },
};


// npx sequelize-cli db:migrate
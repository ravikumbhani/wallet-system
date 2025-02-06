module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('Wallets', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            userId: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'Users',
                    key: 'id',
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE',
            },
            balance: {
                type: Sequelize.DECIMAL(15, 2),
                allowNull: false,
                defaultValue: 0.00,
            },
            currency: {
                type: Sequelize.STRING,
                allowNull: false,
                defaultValue: 'USD',
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
        await queryInterface.dropTable('Wallets');
    },
};


// npx sequelize-cli db:migrate
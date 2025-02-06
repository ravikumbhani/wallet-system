module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.bulkInsert('Users', [
            {
                name: 'John Doe',
                email: 'john.doe@example.com',
                password: '$2b$10$7q9gFf9bP8V0wYqTx8XzL.bjWJh7V1E8GJ9oBS6ZaFoEjb5d3FgKa', // hashed password (bcrypt)
                role: 'user',
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                name: 'Admin User',
                email: 'admin@example.com',
                password: '$2b$10$7q9gFf9bP8V0wYqTx8XzL.bjWJh7V1E8GJ9oBS6ZaFoEjb5d3FgKa', // hashed password (bcrypt)
                role: 'admin',
                createdAt: new Date(),
                updatedAt: new Date(),
            },
        ]);
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.bulkDelete('Users', null, {});
    },
};


// npx sequelize-cli db:seed --seed src/seeds/users.seed.js
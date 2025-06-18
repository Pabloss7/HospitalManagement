const { syncDatabase } = require('./models');
const app = require('./app');
const db = require('./config/db');
const setupUser = require('./config/setup');
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './hospital_management.db'
});

// Initialize models
const User = setupUser(sequelize);

const startServer = async () => {
    try {
        // Sync database before starting the server
        await syncDatabase();
        
        // Start your server
        app.listen(3000, () => {
            console.log(`Server is running on port 3000`);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
    }
};

startServer();
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

// Sync database
sequelize.sync()
    .then(() => {
        console.log('Database synchronized');
        const PORT = process.env.PORT || 3000;
        app.listen(PORT, () => {
            console.log(`Server running at http://localhost:${PORT}/hospitalManagement`);
        });
    })
    .catch(error => {
        console.error('Error syncing database:', error);
    });
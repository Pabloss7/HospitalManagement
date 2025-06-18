const { Sequelize } = require('sequelize');


const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './hospital_management.db',
    logging: console.log
});

async function testConnection() {
    try {
        await sequelize.authenticate();
        console.log('Connection to SQLite database has been established successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
}

testConnection();

module.exports = sequelize;

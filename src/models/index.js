const sequelize = require('../config/db');
const setupUser = require('../config/setup');

// Initialize the model
const User = setupUser(sequelize);

// Sync all models with the database
sequelize.sync()
  .then(() => {
    console.log('Database & tables created!');
  })
  .catch((error) => {
    console.error('Error syncing database:', error);
  });

module.exports = {
  User
};
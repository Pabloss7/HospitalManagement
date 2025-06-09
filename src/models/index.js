const sequelize = require('../config/db');
const setupModels = require('../config/setup');

const { User, Department, DoctorDepartment } = setupModels(sequelize);

module.exports = {
  User,
  Department,
  DoctorDepartment,
  sequelize
};
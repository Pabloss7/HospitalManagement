const sequelize = require('../config/db');
const setupModels = require('../config/setup');

const { User, Department, DoctorDepartment, Availability } = setupModels(sequelize);

module.exports = {
  User,
  Department,
  DoctorDepartment,
  Availability,
  sequelize
};
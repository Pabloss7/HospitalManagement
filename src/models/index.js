const sequelize = require('../config/db');
const setupModels = require('../config/setup');

const { User, Department, DoctorDepartment, Availability, Appointment, MedicalRecord } = setupModels(sequelize);

const Log = sequelize.define('Log', {
  action: {
    type: DataTypes.STRING,
    allowNull: false
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  details: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  timestamp: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
});

module.exports = {
  User,
  Department,
  DoctorDepartment,
  Availability,
  Appointment,
  MedicalRecord,
  sequelize,
  Log
};
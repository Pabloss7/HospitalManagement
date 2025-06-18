const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const DoctorDepartment = sequelize.define('DoctorDepartment', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    }
  });

  return DoctorDepartment;
};
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Availability = sequelize.define('Availability', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    doctorId: {  
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users',  
        key: 'id'
      }
    },
    Date: {
      type: DataTypes.DATE,
      allowNull: false
    },
    startTime: {
      type: DataTypes.TIME,
      allowNull: false
    },
    endTime: {
      type: DataTypes.TIME,
      allowNull: false
    },
    isAvailable: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    }
  });

  return Availability;
};
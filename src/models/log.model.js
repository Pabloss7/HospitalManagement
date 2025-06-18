const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Log = sequelize.define('Log', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    action: {
      type: DataTypes.STRING(100), // Limit the string length
      allowNull: false
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'Users',
        key: 'id'
      }
    },
    details: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    timestamp: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      allowNull: false
    }
  }, {
    indexes: [
      {
        fields: ['action']
      },
      {
        fields: ['userId']
      },
      {
        fields: ['timestamp']
      }
    ]
  });

  return Log;
};
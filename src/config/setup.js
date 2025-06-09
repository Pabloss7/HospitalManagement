const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const User = sequelize.define('User', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    age: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    gender: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isIn: [['male', 'female', 'other']]
      }
    },
    address: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [10, 100]
      }
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [10, 10]
      }
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    role: {
      type: DataTypes.ENUM('patient', 'doctor', 'admin'),
      allowNull: false,
      defaultValue: 'patient'
    }
  });
  const Department = sequelize.define('Department', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    }
  });
  const DoctorDepartment = sequelize.define('DoctorDepartment', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    }
  });
  
  // Set up associations
  User.belongsToMany(Department, {
    through: DoctorDepartment,
    foreignKey: 'userId',
    otherKey: 'departmentId',
    scope: {
      role: 'doctor'
    }
  });
  Department.belongsToMany(User, {
    through: DoctorDepartment,
    foreignKey: 'departmentId',
    otherKey: 'userId'
  });
  return { User, Department, DoctorDepartment };
};

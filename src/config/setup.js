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
  const Appointment = sequelize.define('Appointment', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    patientId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id'
      }
    },
    doctorId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id'
      }
    },
    availabilityId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Availabilities',
        key: 'id'
      }
    },
    status: {
      type: DataTypes.ENUM('pending', 'confirmed', 'completed', 'cancelled'),
      defaultValue: 'pending',
      allowNull: false
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    }
  });
  
  // Add associations for appointments
  User.hasMany(Appointment, {
    foreignKey: 'patientId',
    as: 'patientAppointments',
    scope: {
      role: 'patient'
    }
  });
  
  User.hasMany(Appointment, {
    foreignKey: 'doctorId',
    as: 'doctorAppointments',
    scope: {
      role: 'doctor'
    }
  });
  
  Appointment.belongsTo(User, {
    foreignKey: 'patientId',
    as: 'patient'
  });
  
  Appointment.belongsTo(User, {
    foreignKey: 'doctorId',
    as: 'doctor'
  });
  
  Appointment.belongsTo(Availability, {
    foreignKey: 'availabilityId',
    as: 'timeSlot'
  });
  
  Availability.hasOne(Appointment, {
    foreignKey: 'availabilityId',
    as: 'appointment'
  });

  return { User, Department, DoctorDepartment, Availability, Appointment };
};

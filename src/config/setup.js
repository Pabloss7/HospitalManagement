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

  const MedicalRecord = sequelize.define('MedicalRecord', {
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
      patientId: {
          type: DataTypes.INTEGER,
          allowNull: false,
          references: {
              model: 'Users',
              key: 'id'
          }
      },
      diagnosis: {
          type: DataTypes.TEXT,
          allowNull: false
      },
      prescriptions: {
          type: DataTypes.JSON,
          allowNull: false,
          defaultValue: [],
          validate: {
              isValidPrescriptions(value) {
                  if (!Array.isArray(value)) throw new Error('Prescriptions must be an array');
                  value.forEach(prescription => {
                      if (!prescription.name || !prescription.dosis || !prescription.duration) {
                          throw new Error('Each prescription must have name, dosis, and duration');
                      }
                  });
              }
          }
      },
      testResults: {
          type: DataTypes.JSON,
          allowNull: false,
          defaultValue: [],
          validate: {
              isValidTestResults(value) {
                  if (!Array.isArray(value)) throw new Error('Test results must be an array');
                  value.forEach(test => {
                      if (!test.name || !test.result || !test.date) {
                          throw new Error('Each test result must have name, result, and date');
                      }
                  });
              }
          }
      },
      treatments: {
          type: DataTypes.JSON,
          allowNull: false,
          defaultValue: [],
          validate: {
              isValidTreatments(value) {
                  if (!Array.isArray(value)) throw new Error('Treatments must be an array');
                  value.forEach(treatment => {
                      if (!treatment.treatmentName || !treatment.status || 
                          !treatment.startDate || !treatment.endDate) {
                          throw new Error('Each treatment must have treatmentName, status, startDate, and endDate');
                      }
                  });
              }
          }
      },
      notes: {
          type: DataTypes.TEXT,
          allowNull: true
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
  
  // Add associations for medical records
  User.hasMany(MedicalRecord, {
      foreignKey: 'patientId',
      as: 'patientMedicalRecords',
      scope: {
          role: 'patient'
      }
  });
  
  User.hasMany(MedicalRecord, {
      foreignKey: 'doctorId',
      as: 'doctorMedicalRecords',
      scope: {
          role: 'doctor'
      }
  });
  
  MedicalRecord.belongsTo(User, {
      foreignKey: 'patientId',
      as: 'patient'
  });
  
  MedicalRecord.belongsTo(User, {
      foreignKey: 'doctorId',
      as: 'doctor'
  });

  // Add associations for doctors and departments
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

  return { User, Department, DoctorDepartment, Availability, Appointment, MedicalRecord };
};

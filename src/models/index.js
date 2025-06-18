const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

// Import models
const UserModel = require('./user.model');
const DepartmentModel = require('./department.model');
const DoctorDepartmentModel = require('./doctor-department.model');
const AvailabilityModel = require('./availability.model');
const AppointmentModel = require('./appointment.model');
const MedicalRecordModel = require('./medical-record.model');
const LogModel = require('./log.model');

// Initialize models
const User = UserModel(sequelize);
const Department = DepartmentModel(sequelize);
const DoctorDepartment = DoctorDepartmentModel(sequelize);
const Availability = AvailabilityModel(sequelize);
const Appointment = AppointmentModel(sequelize);
const MedicalRecord = MedicalRecordModel(sequelize);
const Log = LogModel(sequelize);

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
otherKey: 'departmentId'
});

Department.belongsToMany(User, {
through: DoctorDepartment,
foreignKey: 'departmentId',
otherKey: 'userId'
});

// Add associations for doctor availability
User.hasMany(Availability, {
foreignKey: 'doctorId',
as: 'availabilities'
});

Availability.belongsTo(User, {
foreignKey: 'doctorId',
as: 'doctor'
});

// Sync all models with the database
const syncDatabase = async () => {
    try {
        await sequelize.sync({ alter: true }); // This will create or update tables as needed
        console.log('Database synced successfully');
    } catch (error) {
        console.error('Error syncing database:', error);
    }
};

// Export models and sync function
module.exports = {
    sequelize,
    User,
    Department,
    DoctorDepartment,
    Availability,
    Appointment,
    MedicalRecord,
    Log,
    syncDatabase
};
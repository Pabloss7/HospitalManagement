const { MedicalRecord, User } = require('../models');

class MedicalRecordRepository {
  async createMedicalRecord(recordData) {
    const formattedData = {
      ...recordData,
      prescriptions: Array.isArray(recordData.prescriptions) ? recordData.prescriptions : [],
      testResults: Array.isArray(recordData.testResults) ? recordData.testResults : [],
      treatments: Array.isArray(recordData.treatments) ? recordData.treatments : []
    };

    this.validatePrescriptions(formattedData.prescriptions);
    this.validateTestResults(formattedData.testResults);
    this.validateTreatments(formattedData.treatments);

    return await MedicalRecord.create(formattedData);
  }

  async updateMedicalRecord(recordId, doctorId, updateData) {
    const record = await MedicalRecord.findOne({
      where: {
        id: recordId,
        doctorId: doctorId
      }
    });

    if (!record) {
      throw new Error('Medical record not found or you are not authorized to update it');
    }

    const formattedData = {
      ...updateData,
      prescriptions: Array.isArray(updateData.prescriptions) ? updateData.prescriptions : record.prescriptions,
      testResults: Array.isArray(updateData.testResults) ? updateData.testResults : record.testResults,
      treatments: Array.isArray(updateData.treatments) ? updateData.treatments : record.treatments
    };

    if (Array.isArray(updateData.prescriptions)) {
      this.validatePrescriptions(formattedData.prescriptions);
    }
    if (Array.isArray(updateData.testResults)) {
      this.validateTestResults(formattedData.testResults);
    }
    if (Array.isArray(updateData.treatments)) {
      this.validateTreatments(formattedData.treatments);
    }

    await record.update(formattedData);
    return record;
  }

  async findMedicalRecordById(recordId) {
    return await MedicalRecord.findByPk(recordId);
  }

  validatePrescriptions(prescriptions) {
    prescriptions.forEach(prescription => {
      if (!prescription.name || !prescription.dosis || !prescription.duration) {
        throw new Error('Each prescription must have name, dosis, and duration');
      }
    });
  }

  validateTestResults(testResults) {
    testResults.forEach(test => {
      if (!test.name || !test.result || !test.date) {
        throw new Error('Each test result must have name, result, and date');
      }
    });
  }

  validateTreatments(treatments) {
    treatments.forEach(treatment => {
      if (!treatment.treatmentName || !treatment.status || 
          !treatment.startDate || !treatment.endDate) {
        throw new Error('Each treatment must have treatmentName, status, startDate, and endDate');
      }
    });
  }

  async findPatientById(patientId) {
    return await User.findOne({
      where: {
        id: patientId,
        role: 'patient'
      }
    });
  }

  async findPatientRecords(patientId) {
    return await MedicalRecord.findAll({
      where: { patientId },
      include: [{
        model: User,
        as: 'doctor',
        attributes: ['id', 'name']
      }]
    });
  }
}

module.exports = new MedicalRecordRepository();
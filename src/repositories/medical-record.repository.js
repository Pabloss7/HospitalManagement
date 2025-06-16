const { MedicalRecord, User } = require('../models');

class MedicalRecordRepository {
  async createMedicalRecord(recordData) {
    // Ensure arrays are properly formatted
    const formattedData = {
      ...recordData,
      prescriptions: Array.isArray(recordData.prescriptions) ? recordData.prescriptions : [],
      testResults: Array.isArray(recordData.testResults) ? recordData.testResults : [],
      treatments: Array.isArray(recordData.treatments) ? recordData.treatments : []
    };

    // Validate array contents
    this.validatePrescriptions(formattedData.prescriptions);
    this.validateTestResults(formattedData.testResults);
    this.validateTreatments(formattedData.treatments);

    return await MedicalRecord.create(formattedData);
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
}

module.exports = new MedicalRecordRepository();
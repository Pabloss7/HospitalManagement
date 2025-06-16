const medicalRecordRepository = require('../repositories/medical-record.repository');
const { logAction } = require('../utils/logger');

class MedicalRecordService {
  async createMedicalRecord(recordData) {
    // Validate patient exists
    const patient = await medicalRecordRepository.findPatientById(recordData.patientId);
    if (!patient) {
      throw new Error('Patient not found');
    }

    // Create the medical record
    const record = await medicalRecordRepository.createMedicalRecord(recordData);

    // Log the action
    await logAction(
      'Create Medical Record',
      recordData.doctorId,
      { patientId: recordData.patientId, recordId: record.id }
    );

    return record;
  }
}

module.exports = new MedicalRecordService();
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

  async updateMedicalRecord(recordId, doctorId, updateData) {
    // Validate record exists
    const existingRecord = await medicalRecordRepository.findMedicalRecordById(recordId);
    if (!existingRecord) {
      throw new Error('Medical record not found');
    }

    // Validate patient exists
    const patient = await medicalRecordRepository.findPatientById(updateData.patientId);
    if (!patient) {
      throw new Error('Patient not found');
    }

    // Update the record (this will also verify doctor's ownership)
    const updatedRecord = await medicalRecordRepository.updateMedicalRecord(recordId, doctorId, updateData);

    // Log the action
    await logAction(
      'Update Medical Record',
      doctorId,
      { patientId: updateData.patientId, recordId: recordId }
    );

    return updatedRecord;
  }

  async getPatientRecords(patientId) {
    // Validate patient exists
    const patient = await medicalRecordRepository.findPatientById(patientId);
    if (!patient) {
      throw new Error('Patient not found');
    }

    // Get all medical records for the patient
    const records = await medicalRecordRepository.findPatientRecords(patientId);

    // Format the records according to the API response structure
    return records.map(record => ({
      doctorId: record.doctor.id,
      doctorName: record.doctor.name,
      patientId: record.patientId,
      diagnosis: record.diagnosis,
      prescriptions: record.prescriptions,
      testResults: record.testResults,
      treatments: record.treatments,
      notes: record.notes
    }));
  }
}

module.exports = new MedicalRecordService();
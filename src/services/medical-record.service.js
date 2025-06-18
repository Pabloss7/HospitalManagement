const medicalRecordRepository = require('../repositories/medical-record.repository');
const { logAction } = require('../utils/logger');

class MedicalRecordService {
  async createMedicalRecord(recordData) {
    const patient = await medicalRecordRepository.findPatientById(recordData.patientId);
    if (!patient) {
      throw new Error('Patient not found');
    }

    const record = await medicalRecordRepository.createMedicalRecord(recordData);

    await logAction(
      'Create Medical Record',
      recordData.doctorId,
      { patientId: recordData.patientId, recordId: record.id }
    );

    return record;
  }

  async updateMedicalRecord(recordId, doctorId, updateData) {
    const existingRecord = await medicalRecordRepository.findMedicalRecordById(recordId);
    if (!existingRecord) {
      throw new Error('Medical record not found');
    }

    const patient = await medicalRecordRepository.findPatientById(updateData.patientId);
    if (!patient) {
      throw new Error('Patient not found');
    }
    const updatedRecord = await medicalRecordRepository.updateMedicalRecord(recordId, doctorId, updateData);

    await logAction(
      'Update Medical Record',
      doctorId,
      { patientId: updateData.patientId, recordId: recordId }
    );

    return updatedRecord;
  }

  async getPatientRecords(patientId) {
    const patient = await medicalRecordRepository.findPatientById(patientId);
    if (!patient) {
      throw new Error('Patient not found');
    }

    const records = await medicalRecordRepository.findPatientRecords(patientId);

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
const medicalRecordRepository = require('../repositories/medicalRecord.repository');

const createRecord  = async (record) => {
    const newRecord = await medicalRecordRepository.createRecord(record);
    return newRecord;
};

const getRecordsByPatientId = async (patient_id) => {
    const records = await medicalRecordRepository.getRecordsByPatientId(patient_id);
    return records;
};

const updateRecord = async (id, updates) => {
    const result = await medicalRecordRepository.updateRecord(id,updates);
    if(result.changes === 0){
        throw new Error('Record not found or no changes made');
    }
    return result;
};

module.exports = { createRecord, getRecordsByPatientId, updateRecord };
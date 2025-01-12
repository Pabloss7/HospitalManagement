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

const getRecordByDoctorId = async (doctor_id) =>{
    console.log("Service triggeres for doctorID:", doctor_id);

    const records  = await medicalRecordRepository.getRecordByDoctorId(doctor_id);
    if(!records || records.length === 0){
        throw new Error("No records found for this doctor");
    }
    
    return records;
}

module.exports = { createRecord, getRecordsByPatientId, updateRecord ,getRecordByDoctorId};
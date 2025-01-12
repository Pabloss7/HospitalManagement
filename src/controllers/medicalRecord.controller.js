const medicalRecordService = require('../services/medicalRecord.service');

const createRecord = async (req, res) => {
    try{
        const record = {
            patient_id: req.body.patient_id,
            doctor_id: req.user.id, // Extraer del token JWT
            diagnosis: req.body.diagnosis,
            prescriptions: req.body.prescriptions,
            notes: req.body.notes,
            test_results: req.body.test_results,
            treatments: req.body.treatments
        };
        const newRecord = await medicalRecordService.createRecord(record);
        res.status(201).json(newRecord);
    }catch(error){
        res.status(400).json({ message: error.message});
    }
};

const getMyRecords = async (req, res) => {
    console.log("User ID:", req.user.id);
    try{
        const records = await medicalRecordService.getRecordsByPatientId(req.user.id);
        console.log("RECORDS:", records);
        res.status(200).json(records);
    }catch( error ){
        res.status(400).json({ message: error.message});
    }
};

const updateRecord = async(req, res) => {
    try {
        const updates = {
            diagnosis: req.body.diagnosis,
            prescriptions: req.body.prescriptions,
            notes: req.body.notes,
            test_results: req.body.test_results,
            treatments: req.body.treatments
        };
        const result = await medicalRecordService.updateRecord(req.params.id, updates);
        res.status(200).json(result);
    }catch(error){
        res.status(400).json({ message: error.message});
    }
};

module.exports = { createRecord, getMyRecords, updateRecord };
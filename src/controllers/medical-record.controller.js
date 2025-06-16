const medicalRecordService = require('../services/medical-record.service');

class MedicalRecordController {
  async createMedicalRecord(req, res) {
    try {
      // Validate that the doctor in the token matches the doctorId in the request
      if (req.user.id !== parseInt(req.body.doctorId) || req.user.role !== 'doctor') {
        return res.status(403).json({ error: 'Forbidden: Only doctors can create medical records' });
      }

      // Validate that the patient in the params matches the patientId in the body
      if (parseInt(req.params.patientId) !== parseInt(req.body.patientId)) {
        return res.status(400).json({ error: 'Patient ID mismatch between URL and request body' });
      }

      const record = await medicalRecordService.createMedicalRecord(req.body);

      return res.status(201).json({
        recordID: record.id,
        message: 'record created successfully'
      });
    } catch (error) {
      if (error.message === 'Patient not found') {
        return res.status(400).json({ error: error.message });
      }
      if (error.name === 'ValidationError' || error.name === 'SequelizeValidationError') {
        return res.status(400).json({ error: error.message });
      }
      console.error('Error creating medical record:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
}

module.exports = new MedicalRecordController();
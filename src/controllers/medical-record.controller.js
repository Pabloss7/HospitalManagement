const medicalRecordService = require('../services/medical-record.service');

class MedicalRecordController {
  async createMedicalRecord(req, res) {
    try {
      if (req.user.id !== parseInt(req.body.doctorId) || req.user.role !== 'doctor') {
        return res.status(403).json({ error: 'Forbidden: Only doctors can create medical records' });
      }

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

  async updateMedicalRecord(req, res) {
    try {
      if (req.user.id !== parseInt(req.body.doctorId) || req.user.role !== 'doctor') {
        return res.status(403).json({ error: 'Forbidden: Only doctors can update medical records' });
      }

      if (parseInt(req.params.patientId) !== parseInt(req.body.patientId)) {
        return res.status(400).json({ error: 'Patient ID mismatch between URL and request body' });
      }

      const recordId = parseInt(req.params.recordId);
      const doctorId = req.user.id;

      const updatedRecord = await medicalRecordService.updateMedicalRecord(recordId, doctorId, req.body);

      return res.status(200).json({
        recordID: updatedRecord.id,
        message: 'Medical record updated successfully'
      });
    } catch (error) {
      if (error.message === 'Medical record not found') {
        return res.status(404).json({ error: error.message });
      }
      if (error.message === 'Medical record not found or you are not authorized to update it') {
        return res.status(403).json({ error: error.message });
      }
      if (error.message === 'Patient not found') {
        return res.status(400).json({ error: error.message });
      }
      if (error.name === 'ValidationError' || error.name === 'SequelizeValidationError') {
        return res.status(400).json({ error: error.message });
      }
      console.error('Error updating medical record:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  async getPatientRecords(req, res) {
    try {
      if (req.user.id !== parseInt(req.params.patientId) || req.user.role !== 'patient') {
        return res.status(403).json({ error: 'Forbidden: You can only access your own medical records' });
      }

      const records = await medicalRecordService.getPatientRecords(req.params.patientId);
      return res.status(200).json(records);
    } catch (error) {
      if (error.message === 'Patient not found') {
        return res.status(404).json({ error: error.message });
      }
      console.error('Error retrieving medical records:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
}

module.exports = new MedicalRecordController();
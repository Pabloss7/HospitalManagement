const { MedicalRecord, User } = require('../../../models');
const medicalRecordRepository = require('../../../repositories/medical-record.repository');

// Mock the models
jest.mock('../../../models', () => ({
  MedicalRecord: {
    create: jest.fn(),
    findByPk: jest.fn(),
    findOne: jest.fn(),
    findAll: jest.fn()
  },
  User: {
    findOne: jest.fn()
  }
}));

describe('MedicalRecordRepository', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createMedicalRecord', () => {
    const validRecordData = {
      patientId: 1,
      doctorId: 2,
      diagnosis: 'Test diagnosis',
      prescriptions: [{
        name: 'Medicine A',
        dosis: '10mg',
        duration: '7 days'
      }],
      testResults: [{
        name: 'Blood Test',
        result: 'Normal',
        date: '2023-01-01'
      }],
      treatments: [{
        treatmentName: 'Physical Therapy',
        status: 'ongoing',
        startDate: '2023-01-01',
        endDate: '2023-02-01'
      }]
    };

    it('should create a medical record with valid data', async () => {
      const mockCreatedRecord = { id: 1, ...validRecordData };
      MedicalRecord.create.mockResolvedValue(mockCreatedRecord);

      const result = await medicalRecordRepository.createMedicalRecord(validRecordData);

      expect(MedicalRecord.create).toHaveBeenCalledWith(validRecordData);
      expect(result).toEqual(mockCreatedRecord);
    });

    it('should throw error for invalid prescription data', async () => {
      const invalidData = {
        ...validRecordData,
        prescriptions: [{ name: 'Medicine A' }] // Missing dosis and duration
      };

      await expect(medicalRecordRepository.createMedicalRecord(invalidData))
        .rejects.toThrow('Each prescription must have name, dosis, and duration');
    });

    it('should throw error for invalid test result data', async () => {
      const invalidData = {
        ...validRecordData,
        testResults: [{ name: 'Test' }] // Missing result and date
      };

      await expect(medicalRecordRepository.createMedicalRecord(invalidData))
        .rejects.toThrow('Each test result must have name, result, and date');
    });

    it('should throw error for invalid treatment data', async () => {
      const invalidData = {
        ...validRecordData,
        treatments: [{ treatmentName: 'Treatment' }] // Missing other required fields
      };

      await expect(medicalRecordRepository.createMedicalRecord(invalidData))
        .rejects.toThrow('Each treatment must have treatmentName, status, startDate, and endDate');
    });
  });

  describe('updateMedicalRecord', () => {
    const recordId = 1;
    const doctorId = 2;
    const mockRecord = {
      id: recordId,
      doctorId,
      prescriptions: [],
      testResults: [],
      treatments: [],
      update: jest.fn()
    };

    it('should update medical record when authorized', async () => {
      const updateData = {
        diagnosis: 'Updated diagnosis',
        prescriptions: [{
          name: 'Medicine B',
          dosis: '20mg',
          duration: '5 days'
        }]
      };
      
      MedicalRecord.findOne.mockResolvedValue(mockRecord);
      mockRecord.update.mockImplementation(async function(data) {
        Object.assign(this, data);
        return this;
      });

      const result = await medicalRecordRepository.updateMedicalRecord(recordId, doctorId, updateData);

      expect(MedicalRecord.findOne).toHaveBeenCalledWith({
        where: { id: recordId, doctorId }
      });
      // The repository formats all arrays, even if not provided in updateData
      expect(mockRecord.update).toHaveBeenCalledWith({
        diagnosis: 'Updated diagnosis',
        prescriptions: [{
          name: 'Medicine B',
          dosis: '20mg',
          duration: '5 days'
        }],
        testResults: mockRecord.testResults,
        treatments: mockRecord.treatments
      });
      expect(result).toEqual(expect.objectContaining({
        id: recordId,
        doctorId,
        diagnosis: 'Updated diagnosis',
        prescriptions: [{
          name: 'Medicine B',
          dosis: '20mg',
          duration: '5 days'
        }]
      }));
    });

    it('should throw error when record not found or unauthorized', async () => {
      MedicalRecord.findOne.mockResolvedValue(null);

      await expect(medicalRecordRepository.updateMedicalRecord(recordId, doctorId, {}))
        .rejects.toThrow('Medical record not found or you are not authorized to update it');
    });
  });

  describe('findMedicalRecordById', () => {
    it('should find medical record by id', async () => {
      const mockRecord = { id: 1, diagnosis: 'Test' };
      MedicalRecord.findByPk.mockResolvedValue(mockRecord);

      const result = await medicalRecordRepository.findMedicalRecordById(1);

      expect(MedicalRecord.findByPk).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockRecord);
    });
  });

  describe('findPatientById', () => {
    it('should find patient by id', async () => {
      const mockPatient = { id: 1, name: 'John', role: 'patient' };
      User.findOne.mockResolvedValue(mockPatient);

      const result = await medicalRecordRepository.findPatientById(1);

      expect(User.findOne).toHaveBeenCalledWith({
        where: { id: 1, role: 'patient' }
      });
      expect(result).toEqual(mockPatient);
    });
  });

  describe('findPatientRecords', () => {
    it('should find all medical records for a patient', async () => {
      const mockRecords = [
        { id: 1, patientId: 1, doctor: { id: 2, name: 'Dr. Smith' } }
      ];
      MedicalRecord.findAll.mockResolvedValue(mockRecords);

      const result = await medicalRecordRepository.findPatientRecords(1);

      expect(MedicalRecord.findAll).toHaveBeenCalledWith({
        where: { patientId: 1 },
        include: [{
          model: User,
          as: 'doctor',
          attributes: ['id', 'name']
        }]
      });
      expect(result).toEqual(mockRecords);
    });
  });
});
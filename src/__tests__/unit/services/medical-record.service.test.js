const medicalRecordService = require('../../../services/medical-record.service');
const medicalRecordRepository = require('../../../repositories/medical-record.repository');
const { logAction } = require('../../../utils/logger');

// Mock dependencies
jest.mock('../../../repositories/medical-record.repository');
jest.mock('../../../utils/logger');

describe('MedicalRecordService', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  describe('createMedicalRecord', () => {
    const mockRecordData = {
      patientId: 1,
      doctorId: 2,
      diagnosis: 'Test diagnosis',
      prescriptions: [
        { name: 'Med1', dosis: '10mg', duration: '7 days' }
      ],
      testResults: [
        { name: 'Blood Test', result: 'Normal', date: '2023-12-01' }
      ],
      treatments: [
        { 
          treatmentName: 'Physical Therapy',
          status: 'ongoing',
          startDate: '2023-12-01',
          endDate: '2024-01-01'
        }
      ],
      notes: 'Test notes'
    };

    const mockCreatedRecord = {
      id: 1,
      ...mockRecordData
    };

    it('should create a medical record successfully', async () => {
      // Mock repository responses
      medicalRecordRepository.findPatientById.mockResolvedValue({ id: 1, role: 'patient' });
      medicalRecordRepository.createMedicalRecord.mockResolvedValue(mockCreatedRecord);
      
      const result = await medicalRecordService.createMedicalRecord(mockRecordData);

      // Verify repository calls
      expect(medicalRecordRepository.findPatientById).toHaveBeenCalledWith(mockRecordData.patientId);
      expect(medicalRecordRepository.createMedicalRecord).toHaveBeenCalledWith(mockRecordData);
      
      // Verify logger call
      expect(logAction).toHaveBeenCalledWith(
        'Create Medical Record',
        mockRecordData.doctorId,
        { patientId: mockRecordData.patientId, recordId: mockCreatedRecord.id }
      );

      // Verify result
      expect(result).toEqual(mockCreatedRecord);
    });

    it('should throw error when patient is not found', async () => {
      // Mock patient not found
      medicalRecordRepository.findPatientById.mockResolvedValue(null);

      await expect(medicalRecordService.createMedicalRecord(mockRecordData))
        .rejects
        .toThrow('Patient not found');

      // Verify repository was called but record was not created
      expect(medicalRecordRepository.findPatientById).toHaveBeenCalledWith(mockRecordData.patientId);
      expect(medicalRecordRepository.createMedicalRecord).not.toHaveBeenCalled();
      expect(logAction).not.toHaveBeenCalled();
    });

    it('should handle repository errors during creation', async () => {
      // Mock successful patient find but failed record creation
      medicalRecordRepository.findPatientById.mockResolvedValue({ id: 1, role: 'patient' });
      medicalRecordRepository.createMedicalRecord.mockRejectedValue(new Error('Database error'));

      await expect(medicalRecordService.createMedicalRecord(mockRecordData))
        .rejects
        .toThrow('Database error');

      // Verify calls
      expect(medicalRecordRepository.findPatientById).toHaveBeenCalledWith(mockRecordData.patientId);
      expect(medicalRecordRepository.createMedicalRecord).toHaveBeenCalledWith(mockRecordData);
      expect(logAction).not.toHaveBeenCalled();
    });
  });

  describe('updateMedicalRecord', () => {
    const mockRecordId = 1;
    const mockDoctorId = 2;
    const mockUpdateData = {
      patientId: 1,
      diagnosis: 'Updated diagnosis',
      prescriptions: [
        { name: 'Med2', dosis: '20mg', duration: '14 days' }
      ],
      testResults: [
        { name: 'X-Ray', result: 'Normal', date: '2023-12-02' }
      ],
      treatments: [
        { 
          treatmentName: 'Physiotherapy',
          status: 'completed',
          startDate: '2023-12-01',
          endDate: '2023-12-15'
        }
      ],
      notes: 'Updated notes'
    };

    const mockUpdatedRecord = {
      id: mockRecordId,
      ...mockUpdateData
    };

    it('should update a medical record successfully', async () => {
      // Mock repository responses
      medicalRecordRepository.findMedicalRecordById.mockResolvedValue({ id: mockRecordId });
      medicalRecordRepository.findPatientById.mockResolvedValue({ id: mockUpdateData.patientId, role: 'patient' });
      medicalRecordRepository.updateMedicalRecord.mockResolvedValue(mockUpdatedRecord);

      const result = await medicalRecordService.updateMedicalRecord(mockRecordId, mockDoctorId, mockUpdateData);

      // Verify repository calls
      expect(medicalRecordRepository.findMedicalRecordById).toHaveBeenCalledWith(mockRecordId);
      expect(medicalRecordRepository.findPatientById).toHaveBeenCalledWith(mockUpdateData.patientId);
      expect(medicalRecordRepository.updateMedicalRecord).toHaveBeenCalledWith(
        mockRecordId,
        mockDoctorId,
        mockUpdateData
      );

      // Verify logger call
      expect(logAction).toHaveBeenCalledWith(
        'Update Medical Record',
        mockDoctorId,
        { patientId: mockUpdateData.patientId, recordId: mockRecordId }
      );

      // Verify result
      expect(result).toEqual(mockUpdatedRecord);
    });

    it('should throw error when medical record is not found', async () => {
      medicalRecordRepository.findMedicalRecordById.mockResolvedValue(null);

      await expect(medicalRecordService.updateMedicalRecord(mockRecordId, mockDoctorId, mockUpdateData))
        .rejects
        .toThrow('Medical record not found');

      expect(medicalRecordRepository.updateMedicalRecord).not.toHaveBeenCalled();
      expect(logAction).not.toHaveBeenCalled();
    });

    it('should throw error when patient is not found', async () => {
      medicalRecordRepository.findMedicalRecordById.mockResolvedValue({ id: mockRecordId });
      medicalRecordRepository.findPatientById.mockResolvedValue(null);

      await expect(medicalRecordService.updateMedicalRecord(mockRecordId, mockDoctorId, mockUpdateData))
        .rejects
        .toThrow('Patient not found');

      expect(medicalRecordRepository.updateMedicalRecord).not.toHaveBeenCalled();
      expect(logAction).not.toHaveBeenCalled();
    });
  });

  describe('getPatientRecords', () => {
    const mockPatientId = 1;
    const mockRecords = [
      {
        doctor: { id: 2, name: 'Dr. Smith' },
        patientId: mockPatientId,
        diagnosis: 'Test diagnosis',
        prescriptions: [{ name: 'Med1', dosis: '10mg', duration: '7 days' }],
        testResults: [{ name: 'Blood Test', result: 'Normal', date: '2023-12-01' }],
        treatments: [{ 
          treatmentName: 'Physical Therapy',
          status: 'ongoing',
          startDate: '2023-12-01',
          endDate: '2024-01-01'
        }],
        notes: 'Test notes'
      }
    ];

    it('should get patient records successfully', async () => {
      // Mock repository responses
      medicalRecordRepository.findPatientById.mockResolvedValue({ id: mockPatientId, role: 'patient' });
      medicalRecordRepository.findPatientRecords.mockResolvedValue(mockRecords);

      const result = await medicalRecordService.getPatientRecords(mockPatientId);

      // Verify repository calls
      expect(medicalRecordRepository.findPatientById).toHaveBeenCalledWith(mockPatientId);
      expect(medicalRecordRepository.findPatientRecords).toHaveBeenCalledWith(mockPatientId);

      // Verify result format
      expect(result).toEqual([
        {
          doctorId: mockRecords[0].doctor.id,
          doctorName: mockRecords[0].doctor.name,
          patientId: mockRecords[0].patientId,
          diagnosis: mockRecords[0].diagnosis,
          prescriptions: mockRecords[0].prescriptions,
          testResults: mockRecords[0].testResults,
          treatments: mockRecords[0].treatments,
          notes: mockRecords[0].notes
        }
      ]);
    });

    it('should throw error when patient is not found', async () => {
      medicalRecordRepository.findPatientById.mockResolvedValue(null);

      await expect(medicalRecordService.getPatientRecords(mockPatientId))
        .rejects
        .toThrow('Patient not found');

      expect(medicalRecordRepository.findPatientRecords).not.toHaveBeenCalled();
    });

    it('should return empty array when patient has no records', async () => {
      medicalRecordRepository.findPatientById.mockResolvedValue({ id: mockPatientId, role: 'patient' });
      medicalRecordRepository.findPatientRecords.mockResolvedValue([]);

      const result = await medicalRecordService.getPatientRecords(mockPatientId);

      expect(result).toEqual([]);
      expect(medicalRecordRepository.findPatientRecords).toHaveBeenCalledWith(mockPatientId);
    });
  });
});
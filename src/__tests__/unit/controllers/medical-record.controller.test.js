const medicalRecordController = require('../../../controllers/medical-record.controller');
const medicalRecordService = require('../../../services/medical-record.service');

// Mock the medical record service
jest.mock('../../../services/medical-record.service');

describe('Medical Record Controller', () => {
    let mockReq;
    let mockRes;

    beforeEach(() => {
        mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        mockReq = {
            user: { id: 1, role: 'doctor' },
            body: {},
            params: {}
        };
    });

    describe('createMedicalRecord', () => {
        it('should successfully create a medical record', async () => {
            mockReq.body = {
                doctorId: 1,
                patientId: 2,
                diagnosis: 'Test diagnosis'
            };
            mockReq.params.patientId = '2';
            medicalRecordService.createMedicalRecord.mockResolvedValue({ id: 1 });

            await medicalRecordController.createMedicalRecord(mockReq, mockRes);

            expect(medicalRecordService.createMedicalRecord).toHaveBeenCalledWith(mockReq.body);
            expect(mockRes.status).toHaveBeenCalledWith(201);
            expect(mockRes.json).toHaveBeenCalledWith({
                recordID: 1,
                message: 'record created successfully'
            });
        });

        it('should return 403 if non-doctor tries to create record', async () => {
            mockReq.user.role = 'patient';
            mockReq.body = { doctorId: 1, patientId: 2 };
            mockReq.params.patientId = '2';

            await medicalRecordController.createMedicalRecord(mockReq, mockRes);

            expect(mockRes.status).toHaveBeenCalledWith(403);
            expect(mockRes.json).toHaveBeenCalledWith({
                error: 'Forbidden: Only doctors can create medical records'
            });
        });

        it('should return 400 if patient IDs mismatch', async () => {
            mockReq.body = { doctorId: 1, patientId: 2 };
            mockReq.params.patientId = '3';

            await medicalRecordController.createMedicalRecord(mockReq, mockRes);

            expect(mockRes.status).toHaveBeenCalledWith(400);
            expect(mockRes.json).toHaveBeenCalledWith({
                error: 'Patient ID mismatch between URL and request body'
            });
        });

        it('should return 400 if patient not found', async () => {
            mockReq.body = { doctorId: 1, patientId: 2 };
            mockReq.params.patientId = '2';
            medicalRecordService.createMedicalRecord.mockRejectedValue(new Error('Patient not found'));

            await medicalRecordController.createMedicalRecord(mockReq, mockRes);

            expect(mockRes.status).toHaveBeenCalledWith(400);
            expect(mockRes.json).toHaveBeenCalledWith({ error: 'Patient not found' });
        });
    });

    describe('updateMedicalRecord', () => {
        it('should successfully update a medical record', async () => {
            mockReq.body = {
                doctorId: 1,
                patientId: 2,
                diagnosis: 'Updated diagnosis'
            };
            mockReq.params = { patientId: '2', recordId: '1' };
            medicalRecordService.updateMedicalRecord.mockResolvedValue({ id: 1 });

            await medicalRecordController.updateMedicalRecord(mockReq, mockRes);

            expect(medicalRecordService.updateMedicalRecord).toHaveBeenCalledWith(1, 1, mockReq.body);
            expect(mockRes.status).toHaveBeenCalledWith(200);
            expect(mockRes.json).toHaveBeenCalledWith({
                recordID: 1,
                message: 'Medical record updated successfully'
            });
        });

        it('should return 403 if non-doctor tries to update record', async () => {
            mockReq.user.role = 'patient';
            mockReq.body = { doctorId: 1, patientId: 2 };
            mockReq.params = { patientId: '2', recordId: '1' };

            await medicalRecordController.updateMedicalRecord(mockReq, mockRes);

            expect(mockRes.status).toHaveBeenCalledWith(403);
            expect(mockRes.json).toHaveBeenCalledWith({
                error: 'Forbidden: Only doctors can update medical records'
            });
        });

        it('should return 404 if medical record not found', async () => {
            mockReq.body = { doctorId: 1, patientId: 2 };
            mockReq.params = { patientId: '2', recordId: '1' };
            medicalRecordService.updateMedicalRecord.mockRejectedValue(new Error('Medical record not found'));

            await medicalRecordController.updateMedicalRecord(mockReq, mockRes);

            expect(mockRes.status).toHaveBeenCalledWith(404);
            expect(mockRes.json).toHaveBeenCalledWith({ error: 'Medical record not found' });
        });
    });

    describe('getPatientRecords', () => {
        it('should successfully get patient records', async () => {
            mockReq.user = { id: 2, role: 'patient' };
            mockReq.params.patientId = '2';
            const mockRecords = [{ id: 1, diagnosis: 'Test diagnosis' }];
            medicalRecordService.getPatientRecords.mockResolvedValue(mockRecords);

            await medicalRecordController.getPatientRecords(mockReq, mockRes);

            expect(medicalRecordService.getPatientRecords).toHaveBeenCalledWith('2');
            expect(mockRes.status).toHaveBeenCalledWith(200);
            expect(mockRes.json).toHaveBeenCalledWith(mockRecords);
        });

        it('should return 403 if user tries to access another patient\'s records', async () => {
            mockReq.user = { id: 2, role: 'patient' };
            mockReq.params.patientId = '3';

            await medicalRecordController.getPatientRecords(mockReq, mockRes);

            expect(mockRes.status).toHaveBeenCalledWith(403);
            expect(mockRes.json).toHaveBeenCalledWith({
                error: 'Forbidden: You can only access your own medical records'
            });
        });

        it('should return 404 if patient not found', async () => {
            mockReq.user = { id: 2, role: 'patient' };
            mockReq.params.patientId = '2';
            medicalRecordService.getPatientRecords.mockRejectedValue(new Error('Patient not found'));

            await medicalRecordController.getPatientRecords(mockReq, mockRes);

            expect(mockRes.status).toHaveBeenCalledWith(404);
            expect(mockRes.json).toHaveBeenCalledWith({ error: 'Patient not found' });
        });
    });
});
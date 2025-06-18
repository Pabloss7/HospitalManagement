const doctorController = require('../../../controllers/doctor.controller');
const doctorService = require('../../../services/doctor.service');

// Mock the doctor service
jest.mock('../../../services/doctor.service');

describe('Doctor Controller', () => {
    let mockReq;
    let mockRes;

    beforeEach(() => {
        mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        mockReq = {
            user: { id: 1 },
            body: {},
            params: {}
        };
    });

    describe('addAvailability', () => {
        it('should successfully add availability slots', async () => {
            const availableSlots = [{ date: '2024-01-01', time: '09:00' }];
            mockReq.body = { availableSlots };
            doctorService.addAvailability.mockResolvedValue(availableSlots);

            await doctorController.addAvailability(mockReq, mockRes);

            expect(doctorService.addAvailability).toHaveBeenCalledWith(1, availableSlots);
            expect(mockRes.status).toHaveBeenCalledWith(201);
            expect(mockRes.json).toHaveBeenCalledWith(availableSlots);
        });

        it('should return 400 if availableSlots is not an array', async () => {
            mockReq.body = { availableSlots: 'not an array' };

            await doctorController.addAvailability(mockReq, mockRes);

            expect(mockRes.status).toHaveBeenCalledWith(400);
            expect(mockRes.json).toHaveBeenCalledWith({ message: 'availableSlots must be an array' });
        });

        it('should return 403 if user is not a doctor', async () => {
            mockReq.body = { availableSlots: [] };
            doctorService.addAvailability.mockRejectedValue(new Error('Only doctors can set availability'));

            await doctorController.addAvailability(mockReq, mockRes);

            expect(mockRes.status).toHaveBeenCalledWith(403);
            expect(mockRes.json).toHaveBeenCalledWith({ message: 'Only doctors can set availability' });
        });

        it('should return 409 if there is a scheduling conflict', async () => {
            mockReq.body = { availableSlots: [] };
            doctorService.addAvailability.mockRejectedValue(new Error('Time slot conflict'));

            await doctorController.addAvailability(mockReq, mockRes);

            expect(mockRes.status).toHaveBeenCalledWith(409);
            expect(mockRes.json).toHaveBeenCalledWith({ message: 'Time slot conflict' });
        });
    });

    describe('getAvailability', () => {
        it('should successfully get doctor availability', async () => {
            const availability = [{ date: '2024-01-01', time: '09:00' }];
            mockReq.params.doctorID = '1';
            doctorService.getAvailability.mockResolvedValue(availability);

            await doctorController.getAvailability(mockReq, mockRes);

            expect(doctorService.getAvailability).toHaveBeenCalledWith('1');
            expect(mockRes.json).toHaveBeenCalledWith(availability);
        });

        it('should return 500 if there is an error fetching availability', async () => {
            mockReq.params.doctorID = '1';
            doctorService.getAvailability.mockRejectedValue(new Error('Database error'));

            await doctorController.getAvailability(mockReq, mockRes);

            expect(mockRes.status).toHaveBeenCalledWith(500);
            expect(mockRes.json).toHaveBeenCalledWith({
                message: 'Error fetching availability',
                error: 'Database error'
            });
        });
    });

    describe('updateDoctorAvailability', () => {
        it('should successfully update doctor availability', async () => {
            const availableSlots = [{ date: '2024-01-01', time: '09:00' }];
            mockReq.params.doctorId = '1';
            mockReq.body = { availableSlots };
            doctorService.updateDoctorAvailability.mockResolvedValue(availableSlots);

            await doctorController.updateDoctorAvailability(mockReq, mockRes);

            expect(doctorService.updateDoctorAvailability).toHaveBeenCalledWith(1, availableSlots);
            expect(mockRes.json).toHaveBeenCalledWith({
                message: 'Availability updated successfully',
                slots: availableSlots
            });
        });

        it('should return 403 if doctor tries to update another doctor\'s availability', async () => {
            mockReq.params.doctorId = '2';
            mockReq.body = { availableSlots: [] };

            await doctorController.updateDoctorAvailability(mockReq, mockRes);

            expect(mockRes.status).toHaveBeenCalledWith(403);
            expect(mockRes.json).toHaveBeenCalledWith({
                message: 'You can only update your own availability'
            });
        });

        it('should return 409 if there is a scheduling conflict', async () => {
            mockReq.params.doctorId = '1';
            mockReq.body = { availableSlots: [] };
            doctorService.updateDoctorAvailability.mockRejectedValue(new Error('Time slot conflict'));

            await doctorController.updateDoctorAvailability(mockReq, mockRes);

            expect(mockRes.status).toHaveBeenCalledWith(409);
            expect(mockRes.json).toHaveBeenCalledWith({
                message: 'Time slot conflict'
            });
        });
    });

    describe('getAllDoctors', () => {
        it('should successfully get all doctors', async () => {
            const doctors = [{ id: 1, name: 'Dr. Smith' }];
            doctorService.getAllDoctors.mockResolvedValue(doctors);

            await doctorController.getAllDoctors(mockReq, mockRes);

            expect(doctorService.getAllDoctors).toHaveBeenCalled();
            expect(mockRes.status).toHaveBeenCalledWith(200);
            expect(mockRes.json).toHaveBeenCalledWith(doctors);
        });

        it('should return 500 if there is an error fetching doctors', async () => {
            doctorService.getAllDoctors.mockRejectedValue(new Error('Database error'));

            await doctorController.getAllDoctors(mockReq, mockRes);

            expect(mockRes.status).toHaveBeenCalledWith(500);
            expect(mockRes.json).toHaveBeenCalledWith({ error: 'Internal server error' });
        });
    });
});
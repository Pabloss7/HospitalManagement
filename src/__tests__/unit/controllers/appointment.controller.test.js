const appointmentController = require('../../../controllers/appointment.controller');
const appointmentService = require('../../../services/appointment.service');

// Mock the appointment service
jest.mock('../../../services/appointment.service');

describe('AppointmentController', () => {
    let req, res;

    beforeEach(() => {
        req = {
            body: {},
            params: {},
            user: {}
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis()
        };
        jest.clearAllMocks();
    });

    describe('bookAppointment', () => {
        it('should successfully book an appointment', async () => {
            req.body = {
                patientId: 1,
                doctorId: 2,
                timeSlotId: 3
            };
            
            appointmentService.bookAppointment.mockResolvedValue({ id: 1 });

            await appointmentController.bookAppointment(req, res);

            expect(appointmentService.bookAppointment).toHaveBeenCalledWith(1, 2, 3);
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith({
                appointmentId: 1,
                message: 'Appointment booked successfully'
            });
        });

        it('should return 400 if required fields are missing', async () => {
            req.body = { patientId: 1 }; // Missing doctorId and timeSlotId

            await appointmentController.bookAppointment(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ error: 'Missing required fields' });
        });

        it('should handle time slot unavailable error', async () => {
            req.body = { patientId: 1, doctorId: 2, timeSlotId: 3 };
            appointmentService.bookAppointment.mockRejectedValue(
                new Error('Selected time slot is not available')
            );

            await appointmentController.bookAppointment(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ 
                error: 'Selected time slot is not available' 
            });
        });
    });

    describe('cancelAppointment', () => {
        it('should successfully cancel an appointment', async () => {
            req.params = { appointmentId: 1 };
            req.user = { id: 1 };

            await appointmentController.cancelAppointment(req, res);

            expect(appointmentService.cancelAppointment).toHaveBeenCalledWith(1, 1);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ message: 'Appointment canceled' });
        });

        it('should return 404 if appointment not found', async () => {
            req.params = { appointmentId: 999 };
            req.user = { id: 1 };
            appointmentService.cancelAppointment.mockRejectedValue(
                new Error('Appointment not found')
            );

            await appointmentController.cancelAppointment(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ error: 'Appointment not found' });
        });
    });

    describe('rescheduleAppointment', () => {
        it('should successfully reschedule an appointment', async () => {
            req.params = { appointmentId: 1 };
            req.user = { id: 1 };
            req.body = { doctorId: 2, NewSlotId: 3 };
            
            appointmentService.rescheduleAppointment.mockResolvedValue({ id: 1 });

            await appointmentController.rescheduleAppointment(req, res);

            expect(appointmentService.rescheduleAppointment).toHaveBeenCalledWith(1, 1, 2, 3);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                message: 'Appointment rescheduled successfully',
                appointmentId: 1
            });
        });

        it('should return 400 if required fields are missing', async () => {
            req.params = { appointmentId: 1 };
            req.user = { id: 1 };
            req.body = { doctorId: 2 }; // Missing NewSlotId

            await appointmentController.rescheduleAppointment(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ error: 'Missing required fields' });
        });

        it('should handle time slot unavailable error', async () => {
            req.params = { appointmentId: 1 };
            req.user = { id: 1 };
            req.body = { doctorId: 2, NewSlotId: 3 };
            appointmentService.rescheduleAppointment.mockRejectedValue(
                new Error('Selected time slot is not available')
            );

            await appointmentController.rescheduleAppointment(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ 
                error: 'Selected time slot is not available' 
            });
        });
    });

    describe('getMyAppointments', () => {
        it('should successfully get user appointments', async () => {
            req.user = { id: 1, role: 'patient' };
            const mockAppointments = [{ id: 1, date: '2023-01-01' }];
            
            appointmentService.getUserAppointments.mockResolvedValue(mockAppointments);

            await appointmentController.getMyAppointments(req, res);

            expect(appointmentService.getUserAppointments).toHaveBeenCalledWith(1, 'patient');
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(mockAppointments);
        });

        it('should handle internal server error', async () => {
            req.user = { id: 1, role: 'patient' };
            appointmentService.getUserAppointments.mockRejectedValue(new Error('Database error'));

            await appointmentController.getMyAppointments(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ error: 'Internal server error' });
        });
    });
});
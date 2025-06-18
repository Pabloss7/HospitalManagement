const { User, Appointment, Availability } = require('../../../models');
const appointmentRepository = require('../../../repositories/appointment.repository');

jest.mock('../../../models', () => ({
    User: {
        findOne: jest.fn()
    },
    Appointment: {
        create: jest.fn(),
        findByPk: jest.fn(),
        findAll: jest.fn()
    },
    Availability: {}
}));

describe('AppointmentRepository', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('createAppointment', () => {
        it('should create an appointment successfully', async () => {
            const appointmentData = {
                patientId: 1,
                doctorId: 2,
                availabilityId: 3,
                status: 'scheduled'
            };
            const mockAppointment = { id: 1, ...appointmentData };

            Appointment.create.mockResolvedValue(mockAppointment);

            const result = await appointmentRepository.createAppointment(appointmentData);

            expect(Appointment.create).toHaveBeenCalledWith(appointmentData);
            expect(result).toEqual(mockAppointment);
        });

        it('should throw error if creation fails', async () => {
            const error = new Error('Creation failed');
            Appointment.create.mockRejectedValue(error);

            await expect(appointmentRepository.createAppointment({})).rejects.toThrow(error);
        });
    });

    describe('findAppointmentById', () => {
        it('should find appointment by id with all associations', async () => {
            const mockAppointment = {
                id: 1,
                patientId: 1,
                doctorId: 2,
                patient: { name: 'John Doe' },
                doctor: { name: 'Dr. Smith' },
                timeSlot: { date: '2024-01-01', startTime: '09:00' }
            };

            Appointment.findByPk.mockResolvedValue(mockAppointment);

            const result = await appointmentRepository.findAppointmentById(1);

            expect(Appointment.findByPk).toHaveBeenCalledWith(1, {
                include: [
                    { model: User, as: 'patient', attributes: ['name'] },
                    { model: User, as: 'doctor', attributes: ['name'] },
                    { model: Availability, as: 'timeSlot' }
                ]
            });
            expect(result).toEqual(mockAppointment);
        });

        it('should return null if appointment not found', async () => {
            Appointment.findByPk.mockResolvedValue(null);

            const result = await appointmentRepository.findAppointmentById(999);

            expect(result).toBeNull();
        });
    });

    describe('findPatientAppointments', () => {
        it('should find all appointments for a patient', async () => {
            const mockAppointments = [{
                id: 1,
                patientId: 1,
                doctor: { name: 'Dr. Smith' },
                timeSlot: { date: '2024-01-01' }
            }];

            Appointment.findAll.mockResolvedValue(mockAppointments);

            const result = await appointmentRepository.findPatientAppointments(1);

            expect(Appointment.findAll).toHaveBeenCalledWith({
                where: { patientId: 1 },
                include: [
                    { model: User, as: 'doctor', attributes: ['name'] },
                    { model: Availability, as: 'timeSlot' }
                ]
            });
            expect(result).toEqual(mockAppointments);
        });

        it('should return empty array if no appointments found', async () => {
            Appointment.findAll.mockResolvedValue([]);

            const result = await appointmentRepository.findPatientAppointments(1);

            expect(result).toEqual([]);
        });
    });

    describe('findDoctorAppointments', () => {
        it('should find all appointments for a doctor', async () => {
            const mockAppointments = [{
                id: 1,
                doctorId: 2,
                patient: { name: 'John Doe' },
                timeSlot: { date: '2024-01-01' }
            }];

            Appointment.findAll.mockResolvedValue(mockAppointments);

            const result = await appointmentRepository.findDoctorAppointments(2);

            expect(Appointment.findAll).toHaveBeenCalledWith({
                where: { doctorId: 2 },
                include: [
                    { model: User, as: 'patient', attributes: ['name'] },
                    { model: Availability, as: 'timeSlot' }
                ]
            });
            expect(result).toEqual(mockAppointments);
        });

        it('should return empty array if no appointments found', async () => {
            Appointment.findAll.mockResolvedValue([]);

            const result = await appointmentRepository.findDoctorAppointments(2);

            expect(result).toEqual([]);
        });
    });

    describe('cancelAppointment', () => {
        it('should cancel an appointment successfully', async () => {
            const mockAppointment = {
                id: 1,
                status: 'scheduled',
                update: jest.fn().mockImplementation(function(updates) {
                    Object.assign(this, updates);
                    return this;
                })
            };

            Appointment.findByPk.mockResolvedValue(mockAppointment);

            const result = await appointmentRepository.cancelAppointment(1);

            expect(mockAppointment.update).toHaveBeenCalledWith({ status: 'cancelled' });
            expect(result.status).toBe('cancelled');
        });

        it('should throw error if appointment not found', async () => {
            Appointment.findByPk.mockResolvedValue(null);

            await expect(appointmentRepository.cancelAppointment(999))
                .rejects.toThrow('Appointment not found');
        });
    });

    describe('rescheduleAppointment', () => {
        it('should reschedule an appointment successfully', async () => {
            const mockAppointment = {
                id: 1,
                availabilityId: 1,
                update: jest.fn().mockImplementation(function(updates) {
                    Object.assign(this, updates);
                    return this;
                })
            };

            Appointment.findByPk.mockResolvedValue(mockAppointment);

            const result = await appointmentRepository.rescheduleAppointment(1, 2);

            expect(mockAppointment.update).toHaveBeenCalledWith({ availabilityId: 2 });
            expect(result.availabilityId).toBe(2);
        });

        it('should throw error if appointment not found', async () => {
            Appointment.findByPk.mockResolvedValue(null);

            await expect(appointmentRepository.rescheduleAppointment(999, 2))
                .rejects.toThrow('Appointment not found');
        });
    });
});
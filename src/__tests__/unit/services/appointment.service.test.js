// Mock dependencies before importing the service
jest.mock('../../../repositories/appointment.repository', () => ({
    findAppointmentById: jest.fn(),
    findPatientAppointments: jest.fn(),
    findDoctorAppointments: jest.fn(),
    createAppointment: jest.fn(),
    cancelAppointment: jest.fn(),
    rescheduleAppointment: jest.fn()
}));

jest.mock('../../../models', () => ({
    User: {
        findOne: jest.fn()
    },
    Availability: {
        findOne: jest.fn(),
        update: jest.fn()
    }
}));

jest.mock('../../../utils/logger', () => ({
    logAction: jest.fn()
}));

// Import dependencies after mocking
const appointmentRepository = require('../../../repositories/appointment.repository');
const { User, Availability } = require('../../../models');
const { logAction } = require('../../../utils/logger');
const appointmentService = require('../../../services/appointment.service');

describe('AppointmentService', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('bookAppointment', () => {
        it('should successfully book an appointment', async () => {
            const patientId = 1;
            const doctorId = 2;
            const availabilityId = 3;

            const availability = {
                id: availabilityId,
                doctorId,
                isAvailable: true,
                Date: '2024-01-01',
                startTime: '10:00',
                update: jest.fn()
            };

            const patient = {
                id: patientId,
                role: 'patient'
            };

            const appointment = {
                id: 1,
                patientId,
                doctorId,
                availabilityId
            };

            Availability.findOne.mockResolvedValue(availability);
            User.findOne.mockResolvedValue(patient);
            appointmentRepository.findPatientAppointments.mockResolvedValue([]);
            appointmentRepository.createAppointment.mockResolvedValue(appointment);

            const result = await appointmentService.bookAppointment(patientId, doctorId, availabilityId);

            expect(result).toEqual(appointment);
            expect(Availability.findOne).toHaveBeenCalledWith({
                where: {
                    id: availabilityId,
                    doctorId,
                    isAvailable: true
                }
            });
            expect(availability.update).toHaveBeenCalledWith({ isAvailable: false });
            expect(logAction).toHaveBeenCalledWith('book_appointment', patientId, expect.any(Object));
        });

        it('should throw error when time slot is not available', async () => {
            Availability.findOne.mockResolvedValue(null);

            await expect(
                appointmentService.bookAppointment(1, 2, 3)
            ).rejects.toThrow('Selected time slot is not available');
        });

        it('should throw error when patient is not found', async () => {
            const availability = {
                id: 3,
                doctorId: 2,
                isAvailable: true
            };

            Availability.findOne.mockResolvedValue(availability);
            User.findOne.mockResolvedValue(null);

            await expect(
                appointmentService.bookAppointment(1, 2, 3)
            ).rejects.toThrow('Patient not found');
        });

        it('should throw error when patient has conflicting appointment', async () => {
            const availability = {
                id: 3,
                doctorId: 2,
                isAvailable: true,
                Date: '2024-01-01',
                startTime: '10:00'
            };

            const patient = {
                id: 1,
                role: 'patient'
            };

            const existingAppointment = {
                id: 2,
                timeSlot: {
                    Date: '2024-01-01',
                    startTime: '10:00'
                }
            };

            Availability.findOne.mockResolvedValue(availability);
            User.findOne.mockResolvedValue(patient);
            appointmentRepository.findPatientAppointments.mockResolvedValue([existingAppointment]);

            await expect(
                appointmentService.bookAppointment(1, 2, 3)
            ).rejects.toThrow('Patient already has an appointment at this time');
        });
    });

    describe('cancelAppointment', () => {
        it('should successfully cancel an appointment', async () => {
            const appointmentId = 1;
            const patientId = 1;
            const appointment = {
                id: appointmentId,
                patientId,
                doctorId: 2,
                timeSlot: {
                    update: jest.fn()
                }
            };

            appointmentRepository.findAppointmentById.mockResolvedValue(appointment);
            appointmentRepository.cancelAppointment.mockResolvedValue({ ...appointment, status: 'cancelled' });

            const result = await appointmentService.cancelAppointment(appointmentId, patientId);

            expect(result).toEqual({ ...appointment, status: 'cancelled' });
            expect(appointment.timeSlot.update).toHaveBeenCalledWith({ isAvailable: true });
            expect(logAction).toHaveBeenCalledWith('cancel_appointment', patientId, expect.any(Object));
        });

        it('should throw error when appointment is not found', async () => {
            appointmentRepository.findAppointmentById.mockResolvedValue(null);

            await expect(
                appointmentService.cancelAppointment(1, 1)
            ).rejects.toThrow('Appointment not found');
        });

        it('should throw error when patient is not authorized', async () => {
            const appointment = {
                id: 1,
                patientId: 2, // Different from requesting patient
                doctorId: 3
            };

            appointmentRepository.findAppointmentById.mockResolvedValue(appointment);

            await expect(
                appointmentService.cancelAppointment(1, 1)
            ).rejects.toThrow('Not authorized to cancel this appointment');
        });
    });

    describe('getUserAppointments', () => {
        it('should get patient appointments', async () => {
            const patientId = 1;
            const appointments = [
                { id: 1, patientId, doctorId: 2 },
                { id: 2, patientId, doctorId: 3 }
            ];

            appointmentRepository.findPatientAppointments.mockResolvedValue(appointments);

            const result = await appointmentService.getUserAppointments(patientId, 'patient');

            expect(result).toEqual(appointments);
            expect(appointmentRepository.findPatientAppointments).toHaveBeenCalledWith(patientId);
            expect(logAction).toHaveBeenCalledWith('view_appointments', patientId, expect.any(Object));
        });

        it('should get doctor appointments', async () => {
            const doctorId = 1;
            const appointments = [
                { id: 1, patientId: 2, doctorId },
                { id: 2, patientId: 3, doctorId }
            ];

            appointmentRepository.findDoctorAppointments.mockResolvedValue(appointments);

            const result = await appointmentService.getUserAppointments(doctorId, 'doctor');

            expect(result).toEqual(appointments);
            expect(appointmentRepository.findDoctorAppointments).toHaveBeenCalledWith(doctorId);
            expect(logAction).toHaveBeenCalledWith('view_appointments', doctorId, expect.any(Object));
        });

        it('should throw error for invalid user role', async () => {
            await expect(
                appointmentService.getUserAppointments(1, 'invalid')
            ).rejects.toThrow('Invalid user role');
        });
    });

    describe('rescheduleAppointment', () => {
        it('should successfully reschedule an appointment', async () => {
            const appointmentId = 1;
            const patientId = 1;
            const doctorId = 2;
            const oldSlotId = 3;
            const newSlotId = 4;

            const currentAppointment = {
                id: appointmentId,
                patientId,
                doctorId,
                availabilityId: oldSlotId
            };

            const newSlot = {
                id: newSlotId,
                doctorId,
                isAvailable: true,
                Date: '2024-01-01',
                startTime: '10:00'
            };

            const updatedAppointment = {
                ...currentAppointment,
                availabilityId: newSlotId
            };

            appointmentRepository.findAppointmentById.mockResolvedValue(currentAppointment);
            appointmentRepository.findPatientAppointments.mockResolvedValue([]);
            appointmentRepository.rescheduleAppointment.mockResolvedValue(updatedAppointment);
            Availability.findOne.mockResolvedValue(newSlot);
            Availability.update.mockResolvedValue([1]);

            const result = await appointmentService.rescheduleAppointment(
                appointmentId,
                patientId,
                doctorId,
                newSlotId
            );

            expect(result).toEqual(updatedAppointment);
            expect(appointmentRepository.findAppointmentById).toHaveBeenCalledWith(appointmentId);
            expect(Availability.findOne).toHaveBeenCalledWith({
                where: {
                    id: newSlotId,
                    doctorId,
                    isAvailable: true
                }
            });
            expect(Availability.update).toHaveBeenCalledWith(
                { isAvailable: true },
                { where: { id: oldSlotId } }
            );
            expect(Availability.update).toHaveBeenCalledWith(
                { isAvailable: false },
                { where: { id: newSlotId } }
            );
            expect(logAction).toHaveBeenCalledWith(
                'reschedule_appointment',
                patientId,
                expect.objectContaining({
                    doctorId,
                    oldSlotId,
                    newSlotId,
                    appointmentId
                })
            );
        });

        it('should throw error when appointment is not found', async () => {
            appointmentRepository.findAppointmentById.mockResolvedValue(null);

            await expect(
                appointmentService.rescheduleAppointment(1, 1, 2, 3)
            ).rejects.toThrow('Appointment not found');
        });

        it('should throw error when patient is not authorized', async () => {
            const appointment = {
                id: 1,
                patientId: 2, // Different from the requesting patient
                doctorId: 3,
                availabilityId: 4
            };
            appointmentRepository.findAppointmentById.mockResolvedValue(appointment);

            await expect(
                appointmentService.rescheduleAppointment(1, 1, 3, 5)
            ).rejects.toThrow('Not authorized to modify this appointment');
        });

        it('should throw error when new slot is not available', async () => {
            const appointment = {
                id: 1,
                patientId: 1,
                doctorId: 2,
                availabilityId: 3
            };
            appointmentRepository.findAppointmentById.mockResolvedValue(appointment);
            Availability.findOne.mockResolvedValue(null);

            await expect(
                appointmentService.rescheduleAppointment(1, 1, 2, 4)
            ).rejects.toThrow('Selected time slot is not available');
        });

        it('should throw error when new slot belongs to different doctor', async () => {
            const appointment = {
                id: 1,
                patientId: 1,
                doctorId: 2,
                availabilityId: 3
            };
            const newSlot = {
                id: 4,
                doctorId: 3, // Different doctor
                isAvailable: true
            };
            appointmentRepository.findAppointmentById.mockResolvedValue(appointment);
            Availability.findOne.mockResolvedValue(newSlot);

            await expect(
                appointmentService.rescheduleAppointment(1, 1, 2, 4)
            ).rejects.toThrow('New time slot must belong to the same doctor');
        });

        it('should throw error when patient has conflicting appointment', async () => {
            const appointmentId = 1;
            const appointment = {
                id: appointmentId,
                patientId: 1,
                doctorId: 2,
                availabilityId: 3
            };
            const newSlot = {
                id: 4,
                doctorId: 2,
                isAvailable: true,
                Date: '2024-01-01',
                startTime: '10:00'
            };
            const existingAppointment = {
                id: 2,
                timeSlot: {
                    Date: '2024-01-01',
                    startTime: '10:00'
                }
            };

            appointmentRepository.findAppointmentById.mockResolvedValue(appointment);
            Availability.findOne.mockResolvedValue(newSlot);
            appointmentRepository.findPatientAppointments.mockResolvedValue([existingAppointment]);

            await expect(
                appointmentService.rescheduleAppointment(1, 1, 2, 4)
            ).rejects.toThrow('Patient already has an appointment at this time');
        });
    });
});
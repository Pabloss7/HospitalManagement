const { User, Availability, Department, DoctorDepartment } = require('../../../models');
const doctorRepository = require('../../../repositories/doctor.repository');

jest.mock('../../../models', () => ({
    User: {
        findOne: jest.fn(),
        findAll: jest.fn()
    },
    Availability: {
        create: jest.fn(),
        findAll: jest.fn(),
        findOne: jest.fn()
    },
    Department: {},
    DoctorDepartment: {}
}));

describe('DoctorRepository', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('findDoctorById', () => {
        it('should find a doctor by id', async () => {
            const mockDoctor = { id: 1, name: 'Dr. Smith', role: 'doctor' };
            User.findOne.mockResolvedValue(mockDoctor);

            const result = await doctorRepository.findDoctorById(1);

            expect(User.findOne).toHaveBeenCalledWith({
                where: { id: 1, role: 'doctor' }
            });
            expect(result).toEqual(mockDoctor);
        });

        it('should return null if doctor not found', async () => {
            User.findOne.mockResolvedValue(null);

            const result = await doctorRepository.findDoctorById(999);

            expect(result).toBeNull();
        });
    });

    describe('createAvailability', () => {
        it('should create availability successfully', async () => {
            const availabilityData = {
                doctorId: 1,
                date: '2024-01-01',
                startTime: '09:00',
                endTime: '17:00',
                isAvailable: true
            };
            const mockAvailability = { id: 1, ...availabilityData };

            Availability.create.mockResolvedValue(mockAvailability);

            const result = await doctorRepository.createAvailability(availabilityData);

            expect(Availability.create).toHaveBeenCalledWith(availabilityData);
            expect(result).toEqual(mockAvailability);
        });
    });

    describe('findAvailabilityByDoctor', () => {
        it('should find all availabilities for a doctor', async () => {
            const mockAvailabilities = [
                { id: 1, doctorId: 1, date: '2024-01-01' },
                { id: 2, doctorId: 1, date: '2024-01-02' }
            ];

            Availability.findAll.mockResolvedValue(mockAvailabilities);

            const result = await doctorRepository.findAvailabilityByDoctor(1);

            expect(Availability.findAll).toHaveBeenCalledWith({
                where: { doctorId: 1 },
                order: [['Date', 'ASC'], ['startTime', 'ASC']]
            });
            expect(result).toEqual(mockAvailabilities);
        });

        it('should return empty array if no availabilities found', async () => {
            Availability.findAll.mockResolvedValue([]);

            const result = await doctorRepository.findAvailabilityByDoctor(1);

            expect(result).toEqual([]);
        });
    });

    describe('findAvailabilityById', () => {
        it('should find availability by id and doctorId', async () => {
            const mockAvailability = {
                id: 1,
                doctorId: 1,
                date: '2024-01-01'
            };

            Availability.findOne.mockResolvedValue(mockAvailability);

            const result = await doctorRepository.findAvailabilityById(1, 1);

            expect(Availability.findOne).toHaveBeenCalledWith({
                where: { id: 1, doctorId: 1 }
            });
            expect(result).toEqual(mockAvailability);
        });

        it('should return null if availability not found', async () => {
            Availability.findOne.mockResolvedValue(null);

            const result = await doctorRepository.findAvailabilityById(999, 1);

            expect(result).toBeNull();
        });
    });

    describe('updateAvailability', () => {
        it('should update availability successfully', async () => {
            const mockAvailability = {
                id: 1,
                doctorId: 1,
                date: '2024-01-01',
                update: jest.fn()
            };
            const updateData = { isAvailable: false };
            const updatedAvailability = { ...mockAvailability, ...updateData };

            mockAvailability.update.mockResolvedValue(updatedAvailability);

            const result = await doctorRepository.updateAvailability(mockAvailability, updateData);

            expect(mockAvailability.update).toHaveBeenCalledWith(updateData);
            expect(result).toEqual(updatedAvailability);
        });
    });

    describe('getAllDoctors', () => {
        it('should return all doctors with their departments and availabilities', async () => {
            const mockDoctors = [
                {
                    id: 1,
                    name: 'Dr. Smith',
                    role: 'doctor',
                    Departments: [{ id: 1, name: 'Cardiology' }],
                    availabilities: [{ id: 1, date: '2024-01-01', isAvailable: true }]
                }
            ];

            User.findAll.mockResolvedValue(mockDoctors);

            const result = await doctorRepository.getAllDoctors();

            expect(User.findAll).toHaveBeenCalledWith({
                where: { role: 'doctor' },
                include: [
                    {
                        model: Department,
                        through: DoctorDepartment
                    },
                    {
                        model: Availability,
                        as: 'availabilities',
                        where: { isAvailable: true },
                        required: false
                    }
                ],
                distinct: true
            });
            expect(result).toEqual(mockDoctors);
        });

        it('should return empty array if no doctors found', async () => {
            User.findAll.mockResolvedValue([]);

            const result = await doctorRepository.getAllDoctors();

            expect(result).toEqual([]);
        });
    });
});
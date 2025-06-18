const doctorService = require('../../../services/doctor.service');
const doctorRepository = require('../../../repositories/doctor.repository');
const { User, Availability } = require('../../../models');
const { logAction } = require('../../../utils/logger');

// Mock Sequelize Op
jest.mock('sequelize', () => {
  const Op = {
    or: 'or',
    and: 'and',
    lte: 'lte',
    lt: 'lt',
    gt: 'gt',
    gte: 'gte'
  };
  return { Op };
});

// Mock dependencies
jest.mock('../../../repositories/doctor.repository');
jest.mock('../../../models', () => ({
  User: {
    findOne: jest.fn()
  },
  Availability: {
    findAll: jest.fn(),
    upsert: jest.fn()
  }
}));
jest.mock('../../../utils/logger');

describe('DoctorService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('addAvailability', () => {
    const mockDoctorId = 1;
    const mockAvailableSlots = [
      {
        date: '2023-12-20',
        startTime: '09:00',
        isAvailable: true
      }
    ];

    const mockCreatedAvailability = {
      id: 1,
      doctorId: mockDoctorId,
      Date: new Date('2023-12-20'),
      startTime: '09:00:00',
      endTime: '09:20:00',
      isAvailable: true
    };

    it('should add availability slots successfully', async () => {
      // Mock repository responses
      doctorRepository.findDoctorById.mockResolvedValue({ id: mockDoctorId, role: 'doctor' });
      Availability.findAll.mockResolvedValue([]);
      doctorRepository.createAvailability.mockResolvedValue(mockCreatedAvailability);

      const result = await doctorService.addAvailability(mockDoctorId, mockAvailableSlots);

      // Verify doctor check
      expect(doctorRepository.findDoctorById).toHaveBeenCalledWith(mockDoctorId);

      // Verify conflict check
      expect(Availability.findAll).toHaveBeenCalledWith({
        where: expect.objectContaining({
          doctorId: mockDoctorId,
          Date: expect.any(Date),
          or: expect.any(Array)
        })
      });

      // Verify availability creation
      expect(doctorRepository.createAvailability).toHaveBeenCalledWith({
        doctorId: mockDoctorId,
        Date: expect.any(Date),
        startTime: '09:00:00',
        endTime: '09:20:00',
        isAvailable: true
      });

      // Verify logging
      expect(logAction).toHaveBeenCalledWith(
        'add_availability',
        mockDoctorId,
        { slots: mockAvailableSlots }
      );

      // Verify result
      expect(result).toEqual([mockCreatedAvailability]);
    });

    it('should throw error when doctor is not found', async () => {
      doctorRepository.findDoctorById.mockResolvedValue(null);

      await expect(doctorService.addAvailability(mockDoctorId, mockAvailableSlots))
        .rejects
        .toThrow('Only doctors can set availability');

      expect(Availability.findAll).not.toHaveBeenCalled();
      expect(doctorRepository.createAvailability).not.toHaveBeenCalled();
      expect(logAction).not.toHaveBeenCalled();
    });

    it('should throw error for invalid date format', async () => {
      doctorRepository.findDoctorById.mockResolvedValue({ id: mockDoctorId, role: 'doctor' });

      const invalidSlots = [
        {
          date: 'invalid-date',
          startTime: '09:00',
          isAvailable: true
        }
      ];

      await expect(doctorService.addAvailability(mockDoctorId, invalidSlots))
        .rejects
        .toThrow('Invalid date format');

      expect(Availability.findAll).not.toHaveBeenCalled();
      expect(doctorRepository.createAvailability).not.toHaveBeenCalled();
      expect(logAction).not.toHaveBeenCalled();
    });

    it('should handle time slot conflicts when isAvailable is true', async () => {
      doctorRepository.findDoctorById.mockResolvedValue({ id: mockDoctorId, role: 'doctor' });
      
      const mockConflicts = [
        { destroy: jest.fn().mockResolvedValue(undefined) }
      ];
      Availability.findAll.mockResolvedValue(mockConflicts);
      doctorRepository.createAvailability.mockResolvedValue(mockCreatedAvailability);

      const result = await doctorService.addAvailability(mockDoctorId, mockAvailableSlots);

      expect(mockConflicts[0].destroy).toHaveBeenCalled();
      expect(doctorRepository.createAvailability).toHaveBeenCalled();
      expect(result).toEqual([mockCreatedAvailability]);
    });

    it('should throw error for time slot conflicts when isAvailable is false', async () => {
      doctorRepository.findDoctorById.mockResolvedValue({ id: mockDoctorId, role: 'doctor' });
      
      const conflictingSlots = [
        {
          date: '2023-12-20',
          startTime: '09:00',
          isAvailable: false
        }
      ];

      Availability.findAll.mockResolvedValue([{ id: 2 }]);

      await expect(doctorService.addAvailability(mockDoctorId, conflictingSlots))
        .rejects
        .toThrow('Time slot conflict found for 2023-12-20');

      expect(doctorRepository.createAvailability).not.toHaveBeenCalled();
      expect(logAction).not.toHaveBeenCalled();
    });
  });

  describe('getAvailability', () => {
    const mockDoctorId = 1;
    const mockAvailabilities = [
      {
        id: 1,
        doctorId: mockDoctorId,
        Date: new Date('2023-12-20'),
        startTime: '09:00:00',
        endTime: '09:20:00',
        isAvailable: true
      }
    ];

    it('should return doctor availability successfully', async () => {
      doctorRepository.findAvailabilityByDoctor.mockResolvedValue(mockAvailabilities);

      const result = await doctorService.getAvailability(mockDoctorId);

      expect(doctorRepository.findAvailabilityByDoctor).toHaveBeenCalledWith(mockDoctorId);
      expect(result).toEqual(mockAvailabilities);
    });

    it('should return empty array when no availability found', async () => {
      doctorRepository.findAvailabilityByDoctor.mockResolvedValue([]);

      const result = await doctorService.getAvailability(mockDoctorId);

      expect(doctorRepository.findAvailabilityByDoctor).toHaveBeenCalledWith(mockDoctorId);
      expect(result).toEqual([]);
    });
  });

  describe('updateDoctorAvailability', () => {
    const mockDoctorId = 1;
    const mockAvailableSlots = [
      {
        date: '2023-12-20',
        startTime: '09:00',
        isAvailable: true
      }
    ];

    const mockUpdatedAvailability = {
      id: 1,
      doctorId: mockDoctorId,
      Date: new Date('2023-12-20'),
      startTime: '09:00:00',
      endTime: '09:20:00',
      isAvailable: true
    };

    beforeEach(() => {
      // Reset all mocks
      jest.clearAllMocks();
    });

    it('should update doctor availability successfully', async () => {
      // Mock User.findOne for doctor check
      const mockDoctor = { id: mockDoctorId, role: 'doctor' };
      User.findOne.mockResolvedValue(mockDoctor);

      // Mock Availability.findAll for conflict check
      Availability.findAll.mockResolvedValue([]);

      // Mock Availability.upsert
      Availability.upsert.mockResolvedValue([mockUpdatedAvailability]);

      const result = await doctorService.updateDoctorAvailability(mockDoctorId, mockAvailableSlots);

      // Verify doctor check
      expect(User.findOne).toHaveBeenCalledWith({
        where: { id: mockDoctorId, role: 'doctor' }
      });

      // Verify conflict check
      expect(Availability.findAll).toHaveBeenCalledWith({
        where: expect.objectContaining({
          doctorId: mockDoctorId,
          Date: expect.any(Date),
          isAvailable: true
        })
      });

      // Verify upsert call
      expect(Availability.upsert).toHaveBeenCalledWith({
        doctorId: mockDoctorId,
        Date: expect.any(Date),
        startTime: mockAvailableSlots[0].startTime,
        endTime: '09:20:00',
        isAvailable: true
      });

      // Verify logging
      expect(logAction).toHaveBeenCalledWith(
        'update_availability',
        mockDoctorId,
        { slots: mockAvailableSlots }
      );

      // Verify result
      expect(result).toEqual([mockUpdatedAvailability]);
    });

    it('should throw error when doctor is not found', async () => {
      // Mock doctor not found
      User.findOne.mockResolvedValue(null);

      await expect(doctorService.updateDoctorAvailability(mockDoctorId, mockAvailableSlots))
        .rejects
        .toThrow('Doctor not found');

      expect(Availability.findAll).not.toHaveBeenCalled();
      expect(Availability.upsert).not.toHaveBeenCalled();
      expect(logAction).not.toHaveBeenCalled();
    });

    it('should throw error for invalid date format', async () => {
      // Mock doctor found
      User.findOne.mockResolvedValue({ id: mockDoctorId, role: 'doctor' });

      const invalidSlots = [
        {
          date: 'invalid-date',
          startTime: '09:00',
          isAvailable: true
        }
      ];

      await expect(doctorService.updateDoctorAvailability(mockDoctorId, invalidSlots))
        .rejects
        .toThrow('Invalid date format');

      expect(Availability.findAll).not.toHaveBeenCalled();
      expect(Availability.upsert).not.toHaveBeenCalled();
      expect(logAction).not.toHaveBeenCalled();
    });

    it('should handle conflicting slots by deleting them', async () => {
      // Mock doctor found
      User.findOne.mockResolvedValue({ id: mockDoctorId, role: 'doctor' });

      // Mock conflicting slots
      const mockConflicts = [
        { destroy: jest.fn().mockResolvedValue(undefined) },
        { destroy: jest.fn().mockResolvedValue(undefined) }
      ];
      Availability.findAll.mockResolvedValue(mockConflicts);

      // Mock successful upsert
      Availability.upsert.mockResolvedValue([mockUpdatedAvailability]);

      const result = await doctorService.updateDoctorAvailability(mockDoctorId, mockAvailableSlots);

      // Verify conflicts were deleted
      mockConflicts.forEach(conflict => {
        expect(conflict.destroy).toHaveBeenCalled();
      });

      // Verify new slot was created
      expect(Availability.upsert).toHaveBeenCalled();
      expect(result).toEqual([mockUpdatedAvailability]);
    });
  });

  describe('getAllDoctors', () => {
    const mockDoctors = [
      {
        id: 1,
        name: 'Dr. Smith',
        Departments: [{ name: 'Cardiology' }],
        availabilities: [
          {
            Date: new Date('2023-12-20'),
            startTime: '09:00:00',
            endTime: '09:20:00'
          }
        ]
      },
      {
        id: 2,
        name: 'Dr. Johnson',
        Departments: [],
        availabilities: []
      }
    ];

    it('should return formatted list of all doctors', async () => {
      doctorRepository.getAllDoctors.mockResolvedValue(mockDoctors);

      const result = await doctorService.getAllDoctors();

      expect(doctorRepository.getAllDoctors).toHaveBeenCalled();
      expect(result).toEqual([
        {
          doctorID: 1,
          name: 'Dr. Smith',
          departmentName: 'Cardiology',
          availability: [
            {
              day: expect.any(String),
              startDate: '09:00:00',
              endDate: '09:20:00'
            }
          ]
        },
        {
          doctorID: 2,
          name: 'Dr. Johnson',
          departmentName: '',
          availability: []
        }
      ]);
    });

    it('should handle doctors with no departments or availability', async () => {
      const mockDoctorsWithoutDepartments = [
        {
          id: 1,
          name: 'Dr. Smith',
          Departments: [],
          availabilities: []
        }
      ];

      doctorRepository.getAllDoctors.mockResolvedValue(mockDoctorsWithoutDepartments);

      const result = await doctorService.getAllDoctors();

      expect(doctorRepository.getAllDoctors).toHaveBeenCalled();
      expect(result).toEqual([
        {
          doctorID: 1,
          name: 'Dr. Smith',
          departmentName: '',
          availability: []
        }
      ]);
    });
  });
});
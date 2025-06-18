const departmentService = require('../../../services/department.service');
const { Department, User } = require('../../../models');
const userRepository = require('../../../repositories/user.repository');
const departmentRepository = require('../../../repositories/department.repository');
const { logAction } = require('../../../utils/logger');

// Mock dependencies
jest.mock('../../../models', () => ({
    Department: {
        create: jest.fn(),
        findOne: jest.fn(),
        findByPk: jest.fn()
    },
    User: {}
}));

jest.mock('../../../repositories/user.repository');
jest.mock('../../../repositories/department.repository');
jest.mock('../../../utils/logger');

describe('DepartmentService', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('createDepartment', () => {
        it('should create a department successfully', async () => {
            const departmentData = { name: 'Cardiology' };
            const createdDepartment = { id: 1, ...departmentData };
            
            Department.create.mockResolvedValue(createdDepartment);
            logAction.mockResolvedValue();

            const result = await departmentService.createDepartment(departmentData);

            expect(Department.create).toHaveBeenCalledWith(departmentData);
            expect(logAction).toHaveBeenCalledWith(
                'Department Created',
                null,
                {
                    departmentId: createdDepartment.id,
                    departmentName: createdDepartment.name
                }
            );
            expect(result).toEqual(createdDepartment);
        });

        it('should throw error if department creation fails', async () => {
            const error = new Error('Creation failed');
            Department.create.mockRejectedValue(error);

            await expect(departmentService.createDepartment({})).rejects.toThrow(error);
        });
    });

    describe('getDepartmentByName', () => {
        it('should return department when found', async () => {
            const department = { id: 1, name: 'Cardiology' };
            Department.findOne.mockResolvedValue(department);

            const result = await departmentService.getDepartmentByName('Cardiology');

            expect(Department.findOne).toHaveBeenCalledWith({
                where: { name: 'Cardiology' }
            });
            expect(result).toEqual(department);
        });

        it('should return null when department not found', async () => {
            Department.findOne.mockResolvedValue(null);

            const result = await departmentService.getDepartmentByName('NonExistent');

            expect(result).toBeNull();
        });
    });

    describe('assignDoctorToDepartment', () => {
        it('should assign doctor to department successfully', async () => {
            const mockUser = {
                addDepartment: jest.fn().mockResolvedValue({})
            };
            const mockDepartment = { id: 1, name: 'Cardiology' };

            userRepository.getUserById.mockResolvedValue(mockUser);
            Department.findByPk.mockResolvedValue(mockDepartment);

            const result = await departmentService.assignDoctorToDepartment(1, 1);

            expect(userRepository.getUserById).toHaveBeenCalledWith(1);
            expect(Department.findByPk).toHaveBeenCalledWith(1);
            expect(mockUser.addDepartment).toHaveBeenCalledWith(mockDepartment);
            expect(result).toEqual({ message: 'Doctor assigned to department successfully' });
        });

        it('should throw error if user not found', async () => {
            userRepository.getUserById.mockResolvedValue(null);

            await expect(departmentService.assignDoctorToDepartment(1, 1))
                .rejects.toThrow('User not found');
        
            expect(Department.findByPk).not.toHaveBeenCalled();
        });

        it('should throw error if department not found', async () => {
            const mockUser = {
                addDepartment: jest.fn()
            };
            userRepository.getUserById.mockResolvedValue(mockUser);
            Department.findByPk.mockResolvedValue(null);

            await expect(departmentService.assignDoctorToDepartment(1, 1))
                .rejects.toThrow('Department not found');
        
            expect(mockUser.addDepartment).not.toHaveBeenCalled();
        });
    });

    describe('getAllDepartments', () => {
        it('should return all departments', async () => {
            const mockDepartments = [
                { id: 1, name: 'Cardiology' },
                { id: 2, name: 'Neurology' }
            ];

            departmentRepository.getAllDepartments.mockResolvedValue(mockDepartments);

            const result = await departmentService.getAllDepartments();

            expect(departmentRepository.getAllDepartments).toHaveBeenCalled();
            expect(result).toEqual({
                departments: mockDepartments.map(dept => ({
                    departmentId: dept.id,
                    name: dept.name
                }))
            });
        });

        it('should throw error if fetching departments fails', async () => {
            const error = new Error('Fetch failed');
            departmentRepository.getAllDepartments.mockRejectedValue(error);

            await expect(departmentService.getAllDepartments()).rejects.toThrow(error);
        });
    });

    describe('deleteDepartment', () => {
        it('should delete department successfully', async () => {
            const mockDepartment = { id: 1, name: 'Cardiology' };
            
            departmentRepository.getDepartmentById.mockResolvedValue(mockDepartment);
            departmentRepository.getDepartmentDoctors.mockResolvedValue([]);
            departmentRepository.deleteDepartment.mockResolvedValue();
            logAction.mockResolvedValue();

            const result = await departmentService.deleteDepartment(1);

            expect(departmentRepository.getDepartmentById).toHaveBeenCalledWith(1);
            expect(departmentRepository.getDepartmentDoctors).toHaveBeenCalledWith(1);
            expect(departmentRepository.deleteDepartment).toHaveBeenCalledWith(1);
            expect(logAction).toHaveBeenCalledWith(
                'Department Deleted',
                null,
                {
                    departmentId: mockDepartment.id,
                    departmentName: mockDepartment.name
                }
            );
            expect(result).toEqual({ message: 'Department deleted' });
        });

        it('should throw error if department not found', async () => {
            departmentRepository.getDepartmentById.mockResolvedValue(null);

            await expect(departmentService.deleteDepartment(1))
                .rejects.toEqual({ status: 404, message: 'Department not found' });
        });

        it('should throw error if department has assigned doctors', async () => {
            const mockDepartment = { id: 1, name: 'Cardiology' };
            const mockDoctors = [{ id: 1, name: 'Dr. Smith' }];

            departmentRepository.getDepartmentById.mockResolvedValue(mockDepartment);
            departmentRepository.getDepartmentDoctors.mockResolvedValue(mockDoctors);

            await expect(departmentService.deleteDepartment(1))
                .rejects.toEqual({ status: 400, message: 'Cannot delete department with assigned doctors' });
        });
    });
});
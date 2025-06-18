const { Department, User, DoctorDepartment } = require('../../../models');
const departmentRepository = require('../../../repositories/department.repository');

jest.mock('../../../models', () => ({
    Department: {
        create: jest.fn(),
        findAll: jest.fn(),
        findByPk: jest.fn(),
        destroy: jest.fn()
    },
    DoctorDepartment: {
        findAll: jest.fn()
    }
}));

describe('DepartmentRepository', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('createDepartment', () => {
        it('should create a department successfully', async () => {
            const departmentData = { name: 'Cardiology' };
            const mockDepartment = { id: 1, ...departmentData };
            
            Department.create.mockResolvedValue(mockDepartment);
            
            const result = await departmentRepository.createDepartment(departmentData);
            
            expect(Department.create).toHaveBeenCalledWith(departmentData);
            expect(result).toEqual(mockDepartment);
        });

        it('should throw an error if creation fails', async () => {
            const error = new Error('Creation failed');
            Department.create.mockRejectedValue(error);
            
            await expect(departmentRepository.createDepartment({})).rejects.toThrow(error);
        });
    });

    describe('getAllDepartments', () => {
        it('should return all departments', async () => {
            const mockDepartments = [
                { id: 1, name: 'Cardiology' },
                { id: 2, name: 'Neurology' }
            ];
            
            Department.findAll.mockResolvedValue(mockDepartments);
            
            const result = await departmentRepository.getAllDepartments();
            
            expect(Department.findAll).toHaveBeenCalledWith({
                attributes: ['id', 'name']
            });
            expect(result).toEqual(mockDepartments);
        });

        it('should throw an error if retrieval fails', async () => {
            const error = new Error('Retrieval failed');
            Department.findAll.mockRejectedValue(error);
            
            await expect(departmentRepository.getAllDepartments()).rejects.toThrow(error);
        });
    });

    describe('getDepartmentById', () => {
        it('should return a department by id', async () => {
            const mockDepartment = { id: 1, name: 'Cardiology' };
            Department.findByPk.mockResolvedValue(mockDepartment);
            
            const result = await departmentRepository.getDepartmentById(1);
            
            expect(Department.findByPk).toHaveBeenCalledWith(1);
            expect(result).toEqual(mockDepartment);
        });

        it('should return null if department not found', async () => {
            Department.findByPk.mockResolvedValue(null);
            
            const result = await departmentRepository.getDepartmentById(999);
            
            expect(result).toBeNull();
        });

        it('should throw an error if retrieval fails', async () => {
            const error = new Error('Retrieval failed');
            Department.findByPk.mockRejectedValue(error);
            
            await expect(departmentRepository.getDepartmentById(1)).rejects.toThrow(error);
        });
    });

    describe('getDepartmentDoctors', () => {
        it('should return doctors for a department', async () => {
            const mockDoctors = [
                { departmentId: 1, userId: 1 },
                { departmentId: 1, userId: 2 }
            ];
            
            DoctorDepartment.findAll.mockResolvedValue(mockDoctors);
            
            const result = await departmentRepository.getDepartmentDoctors(1);
            
            expect(DoctorDepartment.findAll).toHaveBeenCalledWith({
                where: { departmentId: 1 }
            });
            expect(result).toEqual(mockDoctors);
        });

        it('should throw an error if retrieval fails', async () => {
            const error = new Error('Retrieval failed');
            DoctorDepartment.findAll.mockRejectedValue(error);
            
            await expect(departmentRepository.getDepartmentDoctors(1)).rejects.toThrow(error);
        });
    });

    describe('deleteDepartment', () => {
        it('should delete a department successfully', async () => {
            Department.destroy.mockResolvedValue(1);
            
            const result = await departmentRepository.deleteDepartment(1);
            
            expect(Department.destroy).toHaveBeenCalledWith({
                where: { id: 1 }
            });
            expect(result).toBe(1);
        });

        it('should return 0 if department not found', async () => {
            Department.destroy.mockResolvedValue(0);
            
            const result = await departmentRepository.deleteDepartment(999);
            
            expect(result).toBe(0);
        });

        it('should throw an error if deletion fails', async () => {
            const error = new Error('Deletion failed');
            Department.destroy.mockRejectedValue(error);
            
            await expect(departmentRepository.deleteDepartment(1)).rejects.toThrow(error);
        });
    });
});
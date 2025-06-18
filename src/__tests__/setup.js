const createModelMock = () => ({
    findOne: jest.fn(),
    findAll: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    destroy: jest.fn(),
    hasMany: jest.fn(),
    belongsTo: jest.fn(),
    hasOne: jest.fn(),
    belongsToMany: jest.fn(),
    sync: jest.fn()
});

const mockSequelize = {
    define: jest.fn((modelName) => createModelMock()),
    authenticate: jest.fn().mockResolvedValue(null),
    sync: jest.fn().mockResolvedValue(null),
    close: jest.fn().mockResolvedValue(null),
    model: jest.fn(),
    models: {}
};

// Mock Sequelize package
jest.mock('sequelize', () => {
    const actualSequelize = jest.requireActual('sequelize');
    return {
        Sequelize: jest.fn(() => mockSequelize),
        DataTypes: actualSequelize.DataTypes
    };
});

// Mock the database configuration
jest.mock('../config/db', () => mockSequelize);

// Export the mock instance for tests
global.mockSequelize = mockSequelize;

// Mock all models to return the mock instance
jest.mock('../models/index', () => {
    const models = ['User', 'Department', 'DoctorDepartment', 'Availability', 'Appointment', 'MedicalRecord', 'Log']
        .reduce((acc, modelName) => {
            acc[modelName] = createModelMock();
            return acc;
        }, {});
    
    return models;
});


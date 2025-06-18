const { logAction } = require('../../../utils/logger');
const { Log } = require('../../../models');

// Mock the models
jest.mock('../../../models', () => ({
    Log: {
        create: jest.fn()
    }
}));

// Mock console methods
global.console = {
    error: jest.fn(),
    log: jest.fn()
};

describe('Logger Utility', () => {
    beforeEach(() => {
        // Clear all mocks before each test
        jest.clearAllMocks();
    });

    it('should create a log entry with valid parameters', async () => {
        const action = 'test_action';
        const userId = 1;
        const details = { key: 'value' };

        await logAction(action, userId, details);

        expect(Log.create).toHaveBeenCalledWith({
            action: 'test_action',
            userId: 1,
            details: JSON.stringify(details),
            timestamp: expect.any(Date)
        });
        expect(console.error).not.toHaveBeenCalled();
    });

    it('should handle missing action parameter', async () => {
        await logAction(null, 1, { key: 'value' });

        expect(console.error).toHaveBeenCalledWith('Action is required for logging');
        expect(Log.create).not.toHaveBeenCalled();
    });

    it('should handle missing userId', async () => {
        const action = 'test_action';
        const details = { key: 'value' };

        await logAction(action, null, details);

        expect(Log.create).toHaveBeenCalledWith({
            action: 'test_action',
            userId: null,
            details: JSON.stringify(details),
            timestamp: expect.any(Date)
        });
    });

    it('should handle missing details', async () => {
        const action = 'test_action';
        const userId = 1;

        await logAction(action, userId, null);

        expect(Log.create).toHaveBeenCalledWith({
            action: 'test_action',
            userId: 1,
            details: null,
            timestamp: expect.any(Date)
        });
    });

    it('should handle database errors', async () => {
        const action = 'test_action';
        const userId = 1;
        const details = { key: 'value' };
        const error = new Error('Database error');

        Log.create.mockRejectedValue(error);

        await logAction(action, userId, details);

        expect(console.error).toHaveBeenCalledWith('Error storing log:', error);
        expect(console.log).toHaveBeenCalledWith(
            expect.stringMatching(/\[.*\] test_action by user 1: {"key":"value"}$/)
        );
    });

    it('should convert non-string action to string', async () => {
        const action = 123;
        const userId = 1;

        await logAction(action, userId, null);

        expect(Log.create).toHaveBeenCalledWith({
            action: '123',
            userId: 1,
            details: null,
            timestamp: expect.any(Date)
        });
    });

    it('should convert string userId to number', async () => {
        const action = 'test_action';
        const userId = '1';

        await logAction(action, userId, null);

        expect(Log.create).toHaveBeenCalledWith({
            action: 'test_action',
            userId: 1,
            details: null,
            timestamp: expect.any(Date)
        });
    });
});
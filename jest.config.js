module.exports = {
    testEnvironment: 'node',
    moduleDirectories: ['node_modules', 'src'],
    setupFilesAfterEnv: ['./src/__tests__/setup.js'],
    testMatch: ['**/src/__tests__/**/*.test.js'],
    verbose: true,
    moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/src/$1'
    }
};
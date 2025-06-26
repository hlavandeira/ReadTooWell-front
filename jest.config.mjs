export default {
    testEnvironment: 'jsdom',
    setupFiles: ['./jest.setup.js'],
    transform: {
        '^.+\\.jsx?$': ['babel-jest', { configFile: './babel.config.cjs' }],
    },
    moduleFileExtensions: ['js', 'jsx'],
};

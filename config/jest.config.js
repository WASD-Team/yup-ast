module.exports = {
    collectCoverageFrom: [
        'sources/**/*.{js,jsx}',
        '!sources/**/*.test.{js,jsx}',
        // prettier-no-wrap
    ],
    coverageThreshold: {
        global: {
            statements: 98,
            branches: 91,
            functions: 98,
            lines: 98,
        },
    },
    coverageReporters: ['json', 'lcov', 'text-summary'],
    moduleDirectories: ['node_modules', 'app'],
    setupTestFrameworkScriptFile: '<rootDir>/config/test.setup.js',
    testRegex: 'tests/.*\\.test\\.js$',
};

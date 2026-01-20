module.exports = {
    testEnvironment: 'node',
    testMatch: ['<rootDir>/test/api/**/*.test.js'],
    moduleDirectories: ['node_modules', '<rootDir>/node_modules'],
    modulePaths: ['<rootDir>'],
    testTimeout: 60000,
    reporters: [
        "default",
        ["jest-html-reporter", {
            "pageTitle": "API Test Report",
            "outputPath": "./test/reports/test-report.html",
            "includeFailureMsg": true,
            "includeConsoleLog": true
        }]
    ]
};

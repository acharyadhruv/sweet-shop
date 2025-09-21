/** @type {import('jest').Config} */
module.exports = {
    testEnvironment: 'node',  // Node.js environment
    testMatch: ["**/tests/**/*.test.js"],  // detect all *.test.js or *.spec.js files
    moduleFileExtensions: ['js', 'json', 'node'],
    clearMocks: true,           // automatically clear mocks between tests
    coverageDirectory: 'coverage', 
  };
  
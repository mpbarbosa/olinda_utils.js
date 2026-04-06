/** @type {import('jest').Config} */
module.exports = {
	preset: 'ts-jest',
	testEnvironment: 'node',
	testMatch: ['<rootDir>/test/**/*.test.ts', '<rootDir>/test/**/*.benchmark.ts'],
	moduleNameMapper: {
		// Strip .js from relative imports — but NOT from dist/ paths, which are
		// pre-compiled files that integration tests load via require()/import().
		'^(\\.{1,2}/(?!.*dist/).*)\.js$': '$1',
	},
	randomize: true,
	cacheDirectory: '.jest-cache',
	maxWorkers: '50%',
	collectCoverageFrom: ['src/**/*.ts'],
	coverageThreshold: {
		global: { lines: 80, branches: 75, functions: 80, statements: 80 },
	},
	coverageReporters: ['text', 'lcov'],
};

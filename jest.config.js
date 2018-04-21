module.exports = {
  verbose: true,
  bail: true,
  coverageReporters: ['html', 'text'],
  testEnvironment: 'node',
  moduleFileExtensions: [
    'js',
    'json',
  ],
  transform: {
    "^.+\\.js$": '<rootDir>/node_modules/babel-jest'
  }
}

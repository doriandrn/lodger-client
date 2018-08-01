module.exports = {
  verbose: true,
  bail: true,
  coverageReporters: ['html', 'text'],
  testEnvironment: 'node',
  globals: {
    'ts-jest': {
      tsConfigFile: 'tsconfig.json',
      useBabelrc: true
    }
  },
  moduleFileExtensions: [
    'js',
    'jsx',
    'json',
    'ts',
    'tsx'
  ],
  moduleNameMapper: {
    'lodger/(.*)$': '<rootDir>/lodger/$1'
  },
  transform: {
    '^.+\\.js?$': '<rootDir>/node_modules/babel-jest',
    '^.+\\.ts?$': 'ts-jest'
  },
  // transformIgnorePatterns: ['/node_modules/', '/lodger/'],
  testRegex: '(/__tests__/.*| (\\.| /)(test|spec))\\.(jsx?|tsx?)$'
}

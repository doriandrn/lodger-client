module.exports = {
  verbose: true,
  bail: true,
  coverageReporters: ['html', 'text'],
  testEnvironment: 'node',
  globals: {
    'ts-jest': {
      tsConfig: 'tsconfig.json',
      babelConfig: true,
      diagnostics: false
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
    'lodger/(.*)$': '<rootDir>/lodger/$1',
    'forms/(.*)$': '<rootDir>/lodger/lib/forms/$1',
    '~/(.*)$': '<rootDir>/$1',
    'lodger.config': '<rootDir>/lodger.config'
  },
  transform: {
    '^.+\\.jsx?$': 'babel-jest',
    '^.+\\.tsx?$': 'ts-jest'
  },
  // transformIgnorePatterns: ['/node_modules/', '/lodger/'],
  testRegex: '(/__tests__/.*| (\\.| /)(test|spec))\\.(jsx?|tsx?)$'
}

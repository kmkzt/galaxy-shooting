module.exports = {
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': 'babel-jest'
  },
  testRegex: '(\\.|/)(test|spec)\\.(j|t)sx?$',
  moduleNameMapper: {
    '^@/(.*)': '<rootDir>/src/$1'
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  collectCoverage: true,
  collectCoverageFrom: ['src/**/*.ts?(x)']
}

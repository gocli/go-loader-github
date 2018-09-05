const isValidSource = require('../lib/is-valid-source')

describe('Is Valid Source', () => {
  it('returns true for valid repository names', () => {
    expect(isValidSource('username/repository')).toBe(true)
    expect(isValidSource('u/r')).toBe(true)
    expect(isValidSource('u-r/r')).toBe(true)
    expect(isValidSource('u-3r/-3--__itor-')).toBe(true)
    expect(isValidSource('uuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu39/r')).toBe(true)
    expect(isValidSource('u/rrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrr' +
      'rrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrr100')).toBe(true)
  })

  it('returns false for invalid repository names', () => {
    expect(isValidSource('username')).toBe(false)
    expect(isValidSource('username/')).toBe(false)
    expect(isValidSource('/repository')).toBe(false)
    expect(isValidSource('-u/r')).toBe(false)
    expect(isValidSource('u_ser/r')).toBe(false)
    expect(isValidSource('user/r#')).toBe(false)
    expect(isValidSource('uuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu40/r')).toBe(false)
    expect(isValidSource('u/rrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrr' +
      'rrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrr101')).toBe(false)
  })
})

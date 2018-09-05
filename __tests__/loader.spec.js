const mockIsValidTarget = jest.fn()
jest.mock('go-loader-git/lib/is-valid-target', () => mockIsValidTarget)
const mockParseArgs = jest.fn()
jest.mock('go-loader-git/lib/parse-args', () => mockParseArgs)
const mockSetup = jest.fn()
jest.mock('go-loader-git/lib/setup', () => mockSetup)
const mockIsValidSource = jest.fn()
jest.mock('../lib/is-valid-source', () => mockIsValidSource)

const loader = require('../lib/loader')

describe('Loader', () => {
  const args = {}
  const reponame = 'repository'
  const source = `username/${reponame}`
  const sourceLink = `git@github.com:${source}.git`
  const destination = 'destination/path'

  beforeEach(() => {
    mockIsValidTarget.mockReset()
    mockParseArgs.mockReset()
    mockSetup.mockReset()
    mockIsValidSource.mockReset()

    mockIsValidTarget.mockResolvedValue(null)
    mockParseArgs.mockReturnValue({
      _: ['github', source, destination],
      install: true
    })
    mockSetup.mockResolvedValue(null)
    mockIsValidSource.mockReturnValue(true)
  })

  it('rejects if source is invalid', () => {
    mockIsValidSource.mockReturnValue(false)
    return expect(loader.execute(args))
      .rejects.toThrow('source should be a Github repository name specified as username/repository')
  })

  it('validates destination given in arguments', () => {
    return loader.execute(args)
      .then(() => {
        expect(mockIsValidTarget).toHaveBeenCalledTimes(1)
        expect(mockIsValidTarget).toHaveBeenCalledWith(destination)
      })
  })

  it('resolves with the object containing setup path and install flag', () => {
    return expect(loader.execute(args))
      .resolves.toEqual({ path: destination, install: true })
  })

  it('rejects if isValidTarget() rejects', () => {
    const err = 'validation error'
    mockIsValidTarget.mockRejectedValue(new Error(err))
    return expect(loader.execute(args))
      .rejects.toThrow(`failed to load source because of '${err}'`)
  })

  it('calls to setup with destination given in arguments', () => {
    const argv = { _: ['github', source, 'test/path'] }
    mockParseArgs.mockReturnValue(argv)
    return loader.execute(args)
      .then(() => {
        expect(mockSetup).toHaveBeenCalledTimes(1)
        expect(mockSetup).toHaveBeenCalledWith(sourceLink, 'test/path', argv)
      })
  })

  it('calls to setup with destination extracted from repository source', () => {
    const argv = { _: ['github', source] }
    mockParseArgs.mockReturnValue(argv)
    return loader.execute(args)
      .then(() => {
        expect(mockSetup).toHaveBeenCalledTimes(1)
        expect(mockSetup).toHaveBeenCalledWith(sourceLink, reponame, argv)
      })
  })

  it('calls to setup with checkout flag when reference is added to source', () => {
    const reference = 'reference'
    const sourceWithRef = `${source}:${reference}`
    mockParseArgs.mockReturnValue({ _: ['github', sourceWithRef] })
    return loader.execute(args)
      .then(() => {
        expect(mockSetup).toHaveBeenCalledTimes(1)
        expect(mockSetup).toHaveBeenCalledWith(sourceLink, reponame, {
          _: ['github', sourceWithRef],
          checkout: reference
        })
      })
  })
})

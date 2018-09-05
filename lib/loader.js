const parseArgs = require('./parse-args')
const isValidTarget = require('./is-valid-target')

const loadGithub = ({ args }) => {
  const argv = parseArgs(args)
  const source = argv._[1]
  const destination = argv._[2]

  if (!source) {
    return Promise.reject(new Error(`failed to load: source is not specified`))
  }

  if (!destination) {
    return Promise.reject(new Error(`failed to load: destination is not specified`))
  }

  return isValidTarget(destination)
    .then(() => {
      // TODO: You may want to change this
      console.log(`loading ${source} to ${destination}`)
    })
    .then(() => ({ path: destination, install: argv.install }))
    .catch((error) => {
      throw new Error(`failed to load source because of '${error.message}'`)
    })
}

module.exports.execute = loadGithub

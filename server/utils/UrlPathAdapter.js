const path = require('path')
const config = require('../config')

module.exports = {
  toUrl(fpath) {
    const relativePath = path.relative(config.publicPath, fpath)
    const parts = [
      config.serverBaseUrl,
      ...relativePath.split(path.sep)
    ]

    return path.posix.join(...parts)
  },
  toPath(url) {
    const relativePath = path.relative(config.serverBaseUrl, url)
    const parts = [
      config.publicPath,
      ...relativePath.split(path.sep)
    ]

    return path.join(...parts)
  }
}

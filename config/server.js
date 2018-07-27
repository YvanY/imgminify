const path = require('path')

const common = require('./common')
const publicPath = path.resolve(__dirname, '../server/public')

module.exports = {
  ...common,
  publicPath,
  imagePath: path.resolve(publicPath, 'images')
}

// webpack public path
// set empty string to set base url to /
module.exports.clientBaseUrl = ''

// server url
// set empty string to set base url to /
module.exports.serverBaseUrl = ''

module.exports.formatMap = {
  JPEG: {
    type: 'image/jpeg',
    ext: '.jpg'
  },
  PNG: {
    type: 'image/png',
    ext: '.png'
  }
}

// 1x1 => 4:4:0
// 2x1 => 4:2:2
// 2x2 => 4:2:0
module.exports.samplingFactors = ['1x1', '2x1', '2x2']

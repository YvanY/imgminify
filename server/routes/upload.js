const path = require('path')
const fs = require('fs')
const express = require('express')
const multer = require('multer')
const crypto = require('crypto')
const filenamify = require('filenamify')
const gm = require('gm').subClass({ imageMagick: true })
const PngQuant = require('pngquant')
const UrlPathAdapter = require('../utils/UrlPathAdapter')
const mkdirp = require('mkdirp')

const config = require('../config')
const types = Object.values(config.formatMap).map(item => item.type)
const router = express.Router()

const genRandomUploadDir = () => new Promise((resolve, reject) => {
  crypto.pseudoRandomBytes(16, (err, raw) => {
    if (err) return reject(err)

    const dirname = raw.toString('hex')
    const dirpath = path.join(config.imagePath, dirname)

    mkdirp(dirpath, err => err ? reject(err) : resolve(dirpath))
  })
})

const storage = multer.diskStorage({
  async destination(req, file, cb) {
    try {
      cb(undefined, await genRandomUploadDir())
    } catch (err) {
      cb(err)
    }
  },
  filename(req, file, cb) {
    cb(undefined, filenamify(file.originalname))
  }
})

const upload = multer({
  storage,
  fileFilter(req, file, cb) {
    cb(null, types.includes(file.mimetype))
  }
})

const getImageSize = fpath => new Promise((resolve, reject) => {
  gm(fpath).size((err, size) => err ? reject(err) : resolve(size))
})

const saveImage = (rs, filename) =>
  genRandomUploadDir().then(dest =>
    new Promise((resolve, reject) => {
      const fpath = path.join(dest, filename)
      const ws = fs.createWriteStream(fpath)

      rs
        .pipe(ws)
        .on('error', reject)
        .on('finish', () => {
          resolve({
            filename,
            dest,
            path: fpath,
            size: ws.bytesWritten
          })
        })
    })
  )

const handleCommonOption = (img, options = {}) => {
  const { strip, quality, resize } = options

  if (strip) {
    img.strip()
  }

  if (quality) {
    img.quality(quality)
  }

  if (resize) {
    const { width, height, maintainAspectRatio, shrinkOnly } = options
    const args = [width, height]

    if (!maintainAspectRatio) {
      args.push('!')
    }

    if (shrinkOnly) {
      args.push('>')
    }

    img.resize(...args)
  }

  return img
}

router.post('/', upload.single('file'), async (req, res, next) => {
  const {
    file: ofile,
    body = {}
  } = req

  const options = (body.options && JSON.parse(body.options)) || {}

  const originPromise = (async () => {
    const dimonsions = await getImageSize(ofile.path)

    return {
      otype: ofile.mimetype,
      oname: ofile.filename,
      owidth: dimonsions.width,
      oheight: dimonsions.height,
      osize: ofile.size,
      ourl: UrlPathAdapter.toUrl(ofile.path)
    }
  })()

  const jpegPromise = (async () => {
    const img = gm(ofile.path)
    const { interlace, samplingFactor } = options

    handleCommonOption(img, options)

    if (interlace) {
      img.interlace('JPEG')
    }

    if (samplingFactor) {
      const [horizontal, vertical] = samplingFactor.split('x')

      img.samplingFactor(horizontal, vertical)
    }

    const filename = ofile.filename.replace(/(\..*)?$/, config.formatMap.JPEG.ext)
    const rs = img.stream('JPEG')
    const file = await saveImage(rs, filename)
    const dimonsions = await getImageSize(file.path)

    return {
      jtype: config.formatMap.JPEG.type,
      jname: filename,
      jwidth: dimonsions.width,
      jheight: dimonsions.height,
      jsize: file.size,
      jurl: UrlPathAdapter.toUrl(file.path)
    }
  })()

  const pngPromise = (async () => {
    const img = gm(ofile.path)

    handleCommonOption(img, options)

    const filename = ofile.filename.replace(/(\..*)?$/, config.formatMap.PNG.ext)
    const rs = img.stream('PNG').pipe(new PngQuant())
    const file = await saveImage(rs, filename)
    const dimonsions = await getImageSize(file.path)

    return {
      ptype: config.formatMap.PNG.type,
      pname: filename,
      pwidth: dimonsions.width,
      pheight: dimonsions.height,
      psize: file.size,
      purl: UrlPathAdapter.toUrl(file.path)
    }
  })()

  try {
    const infos = await Promise.all([
      originPromise,
      pngPromise,
      jpegPromise
    ])

    res.json(infos.reduce((a, b) => Object.assign(a, b), {}))
  } catch (err) {
    next(err)
  }
})

module.exports = router

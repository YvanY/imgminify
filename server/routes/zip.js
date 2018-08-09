const path = require('path')
const fs = require('fs')
const express = require('express')
const archiver = require('archiver')
const createError = require('http-errors')
const UrlPathAdapter = require('../utils/UrlPathAdapter')

const config = require('../config')
const router = express.Router()

const checkPath = fpath => new Promise((resolve, reject) => {
  if (!fpath.startsWith(config.imagePath)) {
    reject(new Error('Invalid Path'))
  }

  fs.access(fpath, err => err ? reject(err) : resolve())
})

router.post('/', async (req, res, next) => {
  let sources = null

  try {
    sources = JSON.parse(req.body.sources)
  } catch (e) {
    // noop
  }

  if (!(Array.isArray(sources) && sources.length)) {
    return next(createError(400))
  }

  const paths = sources.map(source => UrlPathAdapter.toPath(source))

  try {
    await Promise.all(paths.map(fpath => checkPath(fpath)))
  } catch (e) {
    return next(createError(404))
  }

  const archive = archiver('zip')
  const nameCount = {} // for name conflict

  for (const fpath of paths) {
    const rs = fs.createReadStream(fpath)
    const name = path.basename(fpath)
    let finalName = name
    const count = nameCount[name]

    if (count) {
      const { name: oname, ext } = path.parse(name)

      finalName = `${oname}_${count}${ext}`
    } else {
      nameCount[name] = 0
    }

    nameCount[name]++

    archive.append(rs, { name: finalName })
  }

  res.attachment(`${Date.now()}.zip`)
  archive.on('error', () => res.end())
  archive.pipe(res)
  archive.finalize()
})

module.exports = router

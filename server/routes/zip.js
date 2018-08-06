const path = require('path')
const fs = require('fs')
const express = require('express')
const config = require('../config')
const archiver = require('archiver')

const router = express.Router()

router.post('/', (req, res, next) => {
  const sources = JSON.parse(req.body.sources)
  const archive = archiver('zip')

  sources
    .map(source => path.join(config.publicPath, source))
    .forEach(fpath => {
      const rs = fs.createReadStream(fpath)
      const name = path.basename(fpath)

      archive.append(rs, { name })
    })

  res.attachment(`${Date.now()}.zip`)
  archive.pipe(res)
  archive.finalize()
})

module.exports = router

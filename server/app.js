const express = require('express')
const logger = require('morgan')
const bodyParser = require('body-parser')
const createError = require('http-errors')

const config = require('./config')
const uploadRouter = require('./routes/upload')
const zipRouter = require('./routes/zip')
const isDev = process.env.NODE_ENV !== 'production'
const app = express()

if (isDev) {
  const webpack = require('webpack')
  const webpackDevMiddleware = require('webpack-dev-middleware')
  const webpackHotMiddleware = require('webpack-hot-middleware')
  const webpackConfig = require('../build/webpack.conf')
  const complier = webpack(webpackConfig)

  app.use(webpackDevMiddleware(complier, {
    publicPath: webpackConfig.output.publicPath
  }))
  app.use(webpackHotMiddleware(complier))
}

app.use(logger(isDev ? 'dev' : 'common'))
app.use(bodyParser.urlencoded({ extended: true }))

app.use('/', express.static(config.publicPath))
app.use('/upload', uploadRouter)
app.use('/zip', zipRouter)

app.use((req, res, next) => {
  next(createError(404))
})

app.use((err, req, res, next) => {
  const { status = 500, message } = err

  res.status(status)

  res.json({ error: message })
})

module.exports = app

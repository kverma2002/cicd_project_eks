const config = require('./utils/config')
const express = require('express')
const logger = require('./utils/logger')
const cors = require('cors')
const middleware = require('./utils/middleware')
const uploadRouter = require('./controllers/upload')

const app = express()



app.use(cors())
app.use(express.json())

app.use(middleware.requestLogger)

app.use(express.static('dist'))

app.use('/api/upload', uploadRouter)

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app
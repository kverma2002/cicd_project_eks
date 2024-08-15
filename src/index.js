const app = require('./app') // The Express app
const config = require('./utils/config')
const logger = require('./utils/logger')
const fs = require('fs');

if (!fs.existsSync('converted')) {
  fs.mkdirSync('converted');
}

app.listen(config.PORT, () => {
  logger.info(`Server running on port ${config.PORT}`)
})
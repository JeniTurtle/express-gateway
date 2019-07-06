var winston = require('winston')
var getNamespace = require('continuation-local-storage').getNamespace
var logging = function (logfilename) {
  var winstonLogger = winston.createLogger({
    transports: [
      new winston.transports.File({
        level: 'info',
        filename: logfilename,
        handleExceptions: true,
        json: true,
        colorize: true,
        timestamp: true,
        requestWhitelist: true,
        bodyWhitelist: true,
        eol: '\r\n'
      })

    ],
    exitOnError: false
  })

  winstonLogger.stream = {
    write: function (message, encoding) {
      winstonLogger.info(message)
    }
  }

  // Wrap Winston logger to print reqId in each log
  var formatMessage = function (message) {
    var myRequest = getNamespace('myrequest')
    message = myRequest && myRequest.get('reqId') ? message + ' reqId: ' + myRequest.get('reqId') : message
    return message
  }

  var logger = {
    log: function (level, message) {
      winstonLogger.log(level, formatMessage(message))
    },
    error: function (message) {
      winstonLogger.error(formatMessage(message))
    },
    warn: function (message) {
      winstonLogger.warn(formatMessage(message))
    },
    verbose: function (message) {
      winstonLogger.verbose(formatMessage(message))
    },
    info: function (message) {
      winstonLogger.info(formatMessage(message))
    },
    debug: function (message) {
      winstonLogger.debug(formatMessage(message))
    },
    silly: function (message) {
      winstonLogger.silly(formatMessage(message))
    }
  }
  return logger
}
exports.logging = logging

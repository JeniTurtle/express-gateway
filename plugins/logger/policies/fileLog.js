var log = require('./log.js')
var fs = require('fs')
var path = require('path')
// var bodyParser = require('body-parser')

module.exports = {
  name: 'file-log',
  policy: (getCommonAuthCallback, config) => {
    return (req, res, next) => { // bodyParser.json()(req, res, () => {
      // bodyParser.urlencoded({ extended: true })(req, res, () => {
      // var logId = 4
			const conf = config.systemConfig.plugins['file-log'];
			const logPath = conf['log-dir'] || './logs';
			const transLogfile = path.join(logPath, 'request.log');
			const logger = log.logging(transLogfile);
      const reqInfo = `
				Requested At: ${JSON.stringify(new Date())},
				Requested Headers: ${JSON.stringify(req.headers)},
				Requested Body: ${JSON.stringify(req.body)},
				Requested Url: ${req.originalUrl},
				Requested IP: ${req.ip},
				Requested Id: ${req.egContext.requestID}
			`;
			logger.info(reqInfo);
			fs.openSync(transLogfile, 'w');
      var write = res.write
      var end = res.end
      var chunks = []

      res.write = function newWrite (chunk) {
        chunks.push(chunk)
        write.apply(res, arguments)
      }

      res.end = function newEnd (chunk) {
        if (chunk) { chunks.push(chunk) }
        end.apply(res, arguments)
      }

      // console.log(res);
      // console.log('Response snippet: '+((res.body || '').substr(0,100)));
      res.once('finish', () => {
				const statusCode = res.statusCode.toString()
        // console.log(statusCode);
        // console.log("Requested Id: " + req.egContext.requestID);
        var body = Buffer.concat(chunks).toString('utf8')

				const respInfo = `
					Responsed At: ${JSON.stringify(new Date())},
          Responsed Code: ${statusCode},
          Responsed body: ${body},
          Requested Url: ${req.originalUrl},
          Requested IP: ${req.ip},
          Requested Id: ${req.egContext.requestID}
				`;
				logger.info(respInfo);
      })
      next()
      // });
      // });
    }
  }
}

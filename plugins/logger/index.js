module.exports = {
	version: '1.0.0',
	init: function (pluginContext) {
		let policy = require('./policies/fileLog')
		pluginContext.registerPolicy(policy)
	}
}

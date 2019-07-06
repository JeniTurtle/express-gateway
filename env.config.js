const path = require('path');
const fs = require('fs');
const dotenv = require('dotenv');

const envPath = path.join(__dirname, './env');
const nodeEnv = process.env.NODE_ENV || 'local';
const envFile = '.env';
const envFilePath = path.resolve(envPath, `${envFile}.${nodeEnv}`);

let overConfig = null;

console.log('Env set: NODE_ENV is %s.', nodeEnv);
process.env.ROOT_DIR = __dirname

if (envFilePath) {
	console.log(`==> Registering environment variables from: ${envFilePath}`)

	dotenv.config({ path: envFilePath })

	overConfig = dotenv.parse(fs.readFileSync(envFilePath))

	for (const key in overConfig) {
		process.env[key] = overConfig[key]
	}
}

// console.log('> envConfig:', overConfig)

module.exports = overConfig

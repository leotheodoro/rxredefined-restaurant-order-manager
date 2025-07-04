process.env.NODE_ENV = 'dev'

import { config as dotenvConfig } from 'dotenv'
import { resolve } from 'path'

dotenvConfig({ path: resolve(__dirname, '.env.test') }) 
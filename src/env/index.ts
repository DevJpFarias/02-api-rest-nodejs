import 'dotenv/config'
import { z } from 'zod'

const envSchema = z.object({
  DATABASE_URL: z.string(),
  SERVER_PORT: z.string(),
  NODE_ENV: z.enum(['development', 'test', 'production']).default('production')
})

const _env = envSchema.safeParse(process.env)

if(_env.success === false) {
  console.log('Invalid environment variables!', _env.error.format())

  throw new Error('Invalid environment variables.')
}

export const env = _env.data
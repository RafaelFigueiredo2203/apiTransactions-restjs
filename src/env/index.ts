/* eslint-disable prettier/prettier */
import { config } from 'dotenv'
import { z } from 'zod'

if (process.env.NODE_ENV === 'test'){
  config({
    path: '.env.test', override: true
  })}else{
  config()
  }


const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('production'),
  DATABASE_URL: z.string(),
})

const _env = envSchema.safeParse(process.env)

if(_env.success === false){
  console.error('Invalid enviromente variables', _env.error.format())

  throw new Error('Invalid enviromente variables')
}

export const env = _env.data
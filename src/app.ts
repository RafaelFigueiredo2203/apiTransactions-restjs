/* eslint-disable prettier/prettier */
import cookie from '@fastify/cookie'
import fastify from 'fastify'
import { transactionRoute } from './routes/transactions'

export const app = fastify()

app.register(cookie)

app.addHook('preHandler', async (request, reply) => {
  console.log(`[${request.method}] ${request.url}`)
})

app.register(transactionRoute, {
  prefix: '/transactions',
})

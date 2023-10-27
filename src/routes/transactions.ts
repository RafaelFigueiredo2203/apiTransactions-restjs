/* eslint-disable prettier/prettier */
import { FastifyInstance } from 'fastify'
import crypto, { randomUUID } from 'node:crypto'
import { z } from 'zod'
import { knex } from '../database'
import { checkSessionIdExists } from '../middlewares/checkSessionIdExists'

export async function transactionRoute(app:FastifyInstance) {

  app.get('/', {
    preHandler:[checkSessionIdExists],
  
  }, async (request , reply) =>{

    const {sessionId} = request.cookies

    const transactions = await knex('transactions').where('session_Id', sessionId).select()

    return {transactions}
  })

  app.get('/:id',{
    preHandler:[checkSessionIdExists],
  
  }, async (request) => {
    const getTransactionParamsSchema = z.object({
      id:z.string().uuid(),
    })

    const {id} = getTransactionParamsSchema.parse(request.params)
    const {sessionId} = request.cookies

    const transaction = await knex('transactions').where({
      id,
      session_Id:sessionId
    }).first() 

    return {transaction}
  })

  app.get('/summary',{
    preHandler:[checkSessionIdExists],

  }, async (request) => {
    const {sessionId} = request.cookies
    const summary = await knex('transactions').where('session_Id', sessionId).sum('amount', {as :'totalAmount'}).first()

    return {summary}
  })
 

  app.post('/', async (request, reply) => {
    const createTrasactionBodySchema = z.object({
      title: z.string(),
      amount: z.number(),
      type: z.enum(['credit', 'debit']),
    })

    const {title, amount, type} = createTrasactionBodySchema.parse(request.body)

    let sessionId = request.cookies.sessionId

    if(!sessionId){
      sessionId = randomUUID()

      reply.cookie('sessionId', sessionId,{
        path:'/',
        maxAge:1000 * 60 * 60 * 24 * 7 // 7 days
      })
    }

     await knex('transactions').insert({
      id: crypto.randomUUID(),
      title,
      amount: type === 'credit' ? amount : amount * -1,
      session_Id: sessionId
    })

    return reply.status(201).send()
  })
}

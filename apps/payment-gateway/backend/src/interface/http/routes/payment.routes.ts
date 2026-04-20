import { FastifyInstance } from 'fastify';
import { container } from '../../../infrastructure/di/container';

export async function paymentRoutes(app: FastifyInstance) {
  app.post('/', async (request, reply) => {
    try {
      const idempotencyKey = request.headers['x-idempotency-key'] as string;
      const { createPayment } = container.useCases;
      
      const payment = await createPayment.execute({
        ...(request.body as any),
        idempotencyKey
      });
      
      return reply.code(201).send(payment);
    } catch (error: any) {
      return reply.code(400).send({ error: error.message });
    }
  });

  app.get('/:id', async (request, reply) => {
    const { id } = request.params as { id: string };
    const { sub } = (request as any).user;

    const { getPayment } = container.useCases;
  
    try {
      const payment = await getPayment.execute({ 
        id, 
        requestingUserId: sub 
      });
    
      if (!payment) return reply.code(404).send({ error: 'Not found' });
    
      return payment;
    } catch (error: any) {
      return reply.code(403).send({ error: error.message });
    }
  });
}

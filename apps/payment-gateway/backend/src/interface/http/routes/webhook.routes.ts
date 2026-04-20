import { FastifyInstance } from 'fastify';
import { container } from '../../../infrastructure/di/container';

export async function webhookRoutes(app: FastifyInstance) {
  app.post('/confirm', async (request, reply) => {
    const { paymentId, status } = request.body as any;
    const repo = container.repositories.payment;

    if (!paymentId || !status) {
      return reply.code(400).send({ error: "paymentId e status são obrigatórios" });
    }

    const payment = await repo.findById(paymentId);

    if (!payment) {
      return reply.code(404).send({ error: "Pagamento não encontrado" });
    }

    Object.assign(payment, { 
      props: { 
        ...payment['props'], 
        status,
        updatedAt: new Date() 
      } 
    });

    await repo.save(payment);

    return reply.send({ 
      message: `Pagamento ${paymentId} atualizado para ${status}.` 
    });
  });
}
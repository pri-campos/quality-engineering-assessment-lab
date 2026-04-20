import { FastifyInstance } from 'fastify';
import { env } from '../../../infrastructure/config/env';

export async function legacyRoutes(app: FastifyInstance) {
  if (env.VULN_IMPROPER_INVENTORY) {
    app.get('/v1/legacy/payments/debug', async (request, reply) => {
      return reply.send({
        warning: "Legacy endpoint - DO NOT USE IN PROD",
        data: [{ id: "pay_123", amount: 5000, status: "COMPLETED" }]
      });
    });
  }
}

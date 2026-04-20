import { FastifyInstance } from 'fastify';
import { container } from '../../../infrastructure/di/container';
import { env } from '../../../infrastructure/config/env';

export async function qaBackdoorRoutes(app: FastifyInstance) {
  app.get('/health', async (request, reply) => {
    try {
      const repo = container.repositories.payment;
    
      await (repo as any).prisma.$queryRaw`SELECT 1`;

      return reply.send({
        status: 'backdoor-active',
        timestamp: new Date().toISOString(),
        database: 'connected',
        securityContext: {
          brokenAuth: env.VULN_BROKEN_AUTH,
          idor: env.VULN_IDOR,
          dataExposure: env.VULN_DATA_EXPOSURE,
          sqlInjection: env.VULN_SQL_INJECTION,
          businessLogicDoubleRefund: env.VULN_BUSINESS_LOGIC_DOUBLE_REFUND
        }
      });
    } catch (error) {
      return reply.code(503).send({
        status: 'backdoor-degraded',
        error: 'Database connection failed through container'
      });
    }
  });

  app.delete('/reset', async (request, reply) => {
    const repo = container.repositories.payment;
    try {
      await (repo as any).prisma.payment.deleteMany({});
      
      return reply.send({ 
        message: "Test environment reset successfully",
        clearedAt: new Date().toISOString()
      });
    } catch (error) {
      app.log.error(error);
      return reply.code(500).send({ error: "Failed to reset database" });
    }
  });
}

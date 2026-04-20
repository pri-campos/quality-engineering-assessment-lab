import 'dotenv/config';
import Fastify from 'fastify';
import { env } from '../../infrastructure/config/env';
import { container } from '../../infrastructure/di/container';

import { authRoutes } from './routes/auth.routes';
import { paymentRoutes } from './routes/payment.routes';
import { webhookRoutes } from './routes/webhook.routes';
import { qaBackdoorRoutes } from './routes/qa-backdoor.routes';

const app = Fastify({ logger: true });

async function bootstrap() {
  app.register(authRoutes, { prefix: '/v1/auth' });
  app.register(paymentRoutes, { prefix: '/v1/payments' });
  app.register(webhookRoutes, { prefix: '/v1/webhooks' });
  app.register(qaBackdoorRoutes, { prefix: '/v1/backdoor' });

  app.get('/health', async (request, reply) => {
    try {
      const repo = container.repositories.payment;
      await (repo as any).prisma.$queryRaw`SELECT 1`;

      return { 
        status: 'healthy', 
        db: 'connected',
        environment: env.NODE_ENV,
        version: '1.0.0'
      };
    } catch (error) {
      return reply.status(503).send({ 
        status: 'unhealthy', 
        db: 'disconnected',
        error: 'Database connection failed' 
      });
    }
  });

  try {
    await app.listen({ port: env.PORT, host: '0.0.0.0' });
    console.log(`Payment Gateway Lab running on http://localhost:${env.PORT}`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
}

bootstrap();

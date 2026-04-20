import { FastifyInstance } from 'fastify';
import { AuthenticateUserUseCase } from '../../../application/auth/use-cases/authenticate-user.use-case';

const authenticateUserUseCase = new AuthenticateUserUseCase();

export async function authRoutes(app: FastifyInstance) {
  app.post('/login', async (request, reply) => {
    const { email, password } = request.body as any;

    try {
      const result = await authenticateUserUseCase.execute({ email, password });
      return reply.send(result);
    } catch (error: any) {
      return reply.status(401).send({ error: error.message });
    }
  });
}

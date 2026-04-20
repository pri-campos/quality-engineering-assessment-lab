import { FastifyRequest, FastifyReply } from 'fastify';
import { env } from '../../../infrastructure/config/env';
import jwt from 'jsonwebtoken';

export async function authenticate(request: FastifyRequest, reply: FastifyReply) {
  const authHeader = request.headers.authorization;

  if (!authHeader) {
    return reply.status(401).send({ message: 'Unauthorized' });
  }

  const token = authHeader.split(' ')[1];

  try {
    if (env.VULN_BROKEN_AUTH) {
      const decoded = jwt.decode(token);
      (request as any).user = decoded;
      return;
    }

    const decoded = jwt.verify(token, env.JWT_SECRET);
    (request as any).user = decoded;
  } catch (error) {
    return reply.status(401).send({ message: 'Invalid token' });
  }
}

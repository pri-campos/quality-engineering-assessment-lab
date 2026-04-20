import jwt from 'jsonwebtoken';
import { env } from '../../../infrastructure/config/env';

interface AuthenticateRequest {
  email?: string;
  password?: string;
}

export class AuthenticateUserUseCase {
  async execute({ email, password }: AuthenticateRequest) {
    if (!email || !password) {
      throw new Error('Email and password are required');
    }

    const seedUsers: Record<string, { sub: string; role: string; passwordHash: string }> = {
      [env.QA_USER_EMAIL]: { sub: env.QA_USER_SUB, role: 'USER', passwordHash: env.QA_USER_PASSWORD },
      [env.QA_ADMIN_EMAIL]: { sub: env.QA_ADMIN_SUB, role: 'ADMIN', passwordHash: env.QA_ADMIN_PASSWORD },
    };

    const user = seedUsers[email];

    if (env.VULN_BROKEN_AUTH) {
      console.warn('[VULN] Broken Authentication ativa: Pulando validação de senha!');
    } else {
      if (!user || user.passwordHash !== password) {
        throw new Error('Invalid credentials');
      }
    }

    const targetUser = user || { sub: 'guest', role: 'USER' };

    const token = jwt.sign(
      { sub: targetUser.sub, role: targetUser.role },
      env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    return { token };
  }
}

import { PrismaClient } from '@prisma/client';
import { PostgresPaymentRepository } from '../repositories/postgres/payment.repository';
import { InMemoryEventBus } from '../messaging/in-memory-event-bus';
import { CreatePaymentUseCase } from '../../application/payments/use-cases/create-payment.use-case';
import { GetPaymentUseCase } from '../../application/payments/use-cases/get-payment.use-case';
import { AuthenticateUserUseCase } from '../../application/auth/use-cases/authenticate-user.use-case';

const prismaClient = new PrismaClient();
const paymentRepository = new PostgresPaymentRepository(prismaClient);
const eventBus = new InMemoryEventBus(paymentRepository);

export const container = {
  repositories: {
    payment: paymentRepository,
  },
  useCases: {
    createPayment: new CreatePaymentUseCase(paymentRepository, eventBus),
    getPayment: new GetPaymentUseCase(paymentRepository),
    authenticateUser: new AuthenticateUserUseCase(),
  }
};

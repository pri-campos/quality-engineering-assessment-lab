import { PrismaClient } from '@prisma/client';
import { Payment } from '../../../domain/entities/payment';

export class PostgresPaymentRepository {
  constructor(private prisma: PrismaClient) {}

  private mapToEntity(raw: any): Payment {
    const payment = new Payment({
      userId: raw.userId,
      amount: raw.amount,
      currency: raw.currency,
      idempotencyKey: raw.idempotencyKey,
      creditCardToken: raw.creditCardToken,
      status: raw.status as any,
      history: raw.history as any[],
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt
    }, raw.id);
    return payment;
  }

  async findById(id: string): Promise<Payment | null> {
    const raw = await this.prisma.payment.findUnique({ where: { id } });
    return raw ? this.mapToEntity(raw) : null;
  }

  async findByIdempotencyKey(key: string): Promise<Payment | null> {
    const raw = await this.prisma.payment.findUnique({ where: { idempotencyKey: key } });
    return raw ? this.mapToEntity(raw) : null;
  }

  async save(payment: Payment): Promise<void> {
    const data = payment.toJSON();
    await this.prisma.payment.upsert({
      where: { id: payment.id },
      update: {
        status: data.status,
        history: data.history as any,
        updatedAt: new Date(),
      },
      create: {
        id: payment.id,
        idempotencyKey: data.idempotencyKey,
        userId: data.userId,
        amount: data.amount,
        currency: data.currency,
        status: data.status,
        creditCardToken: data.creditCardToken,
        history: data.history as any,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
      },
    });
  }
}
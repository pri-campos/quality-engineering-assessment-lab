import { Payment } from '../../../domain/entities/payment';
import { env } from '../../../infrastructure/config/env';

export class CreatePaymentUseCase {
  constructor(private paymentRepository: any, private eventBus: any) {}

  async execute(input: any, authenticatedUserId?: string) {
    if (input.idempotencyKey) {
      const existing = await this.paymentRepository.findByIdempotencyKey(input.idempotencyKey);
      if (existing) {
        return existing;
      }
    }

    let finalUserId = authenticatedUserId || env.QA_USER_SUB;

    if (env.VULN_IDOR && input.forcedUserId) {
      finalUserId = input.forcedUserId;
      console.warn(`[VULN] IDOR Ativo: Criando pagamento para o usuário ${finalUserId} ignorando o token.`);
    }

    const payment = new Payment({
      userId: finalUserId,
      amount: input.amount,
      currency: input.currency,
      idempotencyKey: input.idempotencyKey,
      creditCardToken: input.creditCardToken
    });

    await this.paymentRepository.save(payment);

    await this.eventBus.publish({
      type: 'PAYMENT_CREATED',
      payload: { id: payment.id }
    });

    return payment;
  }
}

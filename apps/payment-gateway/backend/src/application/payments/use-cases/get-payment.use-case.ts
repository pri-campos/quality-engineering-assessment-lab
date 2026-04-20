import { env } from '../../../infrastructure/config/env';

interface GetPaymentRequest {
  id: string;
  requestingUserId: string;
}

export class GetPaymentUseCase {
  constructor(private paymentRepository: any) {}

  async execute(input: GetPaymentRequest) {
    if (!input || !input.id) {
      throw new Error("O ID do pagamento é obrigatório para consulta.");
    }

    const payment = await this.paymentRepository.findById(input.id);

    if (!payment) {
      return null;
    }

    const paymentData = payment.toJSON();

    if (!env.VULN_IDOR) {
      if (paymentData.userId !== input.requestingUserId) {
        console.warn(`[Security] Tentativa de IDOR bloqueada. User ${input.requestingUserId} tentou acessar recurso do User ${paymentData.userId}`);
        throw new Error("Acesso negado: você não tem permissão para ver este pagamento.");
      }
    } else {
      console.warn(`[VULN] IDOR Ativo: Permitindo consulta de qualquer ID sem validar o dono.`);
    }

    if (!env.VULN_DATA_EXPOSURE) {
      delete paymentData.creditCardToken;
    } else {
      console.warn(`[VULN] Data Exposure Ativo: Expondo dados sensíveis (CC Token).`);
    }

    return paymentData;
  }
}
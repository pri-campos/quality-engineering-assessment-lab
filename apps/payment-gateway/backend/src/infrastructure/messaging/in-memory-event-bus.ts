
export class InMemoryEventBus {
  constructor(private paymentRepository: any) {}

  async publish(event: any): Promise<void> {
    console.log(`[EventBus] Evento recebido: ${event.type}`);

    setTimeout(async () => {
      const payment = await this.paymentRepository.findById(event.payload.id);

      if (payment && typeof payment.registerAtPartner === 'function') {
        console.log(`[Worker] Processando pagamento ${payment.id}...`);
        
        payment.registerAtPartner();
        
        await this.paymentRepository.save(payment);
        console.log(`[Worker] Status atualizado no banco.`);
      } else {
        console.error(`[Worker ERROR] Pagamento ${event.payload.id} não encontrado.`);
      }
    }, 2000);
  }
}

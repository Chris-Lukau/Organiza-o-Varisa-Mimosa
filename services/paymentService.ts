
import { PaymentMethod, Order } from '../types';

/**
 * Nota: Em produção, estas chamadas seriam para um backend real que interage com APIs de pagamento.
 * Exemplos: AppyPay/é+ (Angola) para MCX Express e Stripe para Cartões Internacionais.
 */

export const processPayment = async (order: Order, method: PaymentMethod): Promise<{ success: boolean; reference?: string; message: string }> => {
  console.log(`Iniciando pagamento para o pedido ${order.id} via ${method}`);
  
  // Simulação de delay de rede
  await new Promise(resolve => setTimeout(resolve, 2000));

  switch (method) {
    case PaymentMethod.MCX_EXPRESS:
      // Simula trigger de notificação no telemóvel do cliente
      return {
        success: true,
        reference: `MCX-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
        message: "Notificação enviada ao seu telemóvel via Multicaixa Express. Por favor, confirme o pagamento na app."
      };

    case PaymentMethod.CARD_STRIPE:
      // Simula o fluxo do Stripe (geração de Client Secret e confirmação)
      return {
        success: true,
        reference: `STRIPE-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
        message: "Pagamento via cartão processado com sucesso através do Stripe Gateway."
      };

    case PaymentMethod.TRANSFER_IBAN:
      return {
        success: true,
        reference: "AO06 0001 0000 0000 0000 0000 0",
        message: "Por favor, realize a transferência para o IBAN indicado e envie o comprovativo por WhatsApp/Email."
      };

    default:
      return { success: false, message: "Método de pagamento não suportado." };
  }
};

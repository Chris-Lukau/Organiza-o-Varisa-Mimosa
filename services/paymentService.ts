
import { PaymentMethod, Order } from '../types';

export const processPayment = async (order: Order, method: PaymentMethod): Promise<{ success: boolean; reference?: string; message: string }> => {
  console.log(`Iniciando pagamento para o pedido ${order.id} via ${method}`);
  
  await new Promise(resolve => setTimeout(resolve, 2000));

  switch (method) {
    case PaymentMethod.MCX_EXPRESS:
      return {
        success: true,
        reference: `MCX-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
        message: "Notificação enviada ao seu telemóvel via Multicaixa Express. Por favor, confirme o pagamento na app."
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

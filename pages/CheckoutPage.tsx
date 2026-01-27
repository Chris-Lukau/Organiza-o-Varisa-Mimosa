
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreditCard, Smartphone, Landmark, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { CartItem, User, PaymentMethod, Order, OrderStatus } from '../types';
import { processPayment } from '../services/paymentService';

interface CheckoutPageProps {
  cart: CartItem[];
  user: User | null;
  clearCart: () => void;
}

const CheckoutPage: React.FC<CheckoutPageProps> = ({ cart, user, clearCart }) => {
  const navigate = useNavigate();
  const [method, setMethod] = useState<PaymentMethod>(PaymentMethod.MCX_EXPRESS);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentResult, setPaymentResult] = useState<{ success: boolean; message: string; reference?: string } | null>(null);

  const total = cart.reduce((acc, i) => acc + (i.price * i.quantity), 0);

  if (!user) {
    return (
      <div className="max-w-md mx-auto py-20 px-4 text-center">
        <AlertCircle size={48} className="mx-auto text-yellow-500 mb-4" />
        <h2 className="text-2xl font-bold mb-4">Acesso Restrito</h2>
        <p className="text-gray-600 mb-8">Você precisa estar logado para finalizar a compra.</p>
        <button onClick={() => navigate('/auth')} className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold">Ir para Login</button>
      </div>
    );
  }

  if (cart.length === 0 && !paymentResult) {
    return (
      <div className="max-w-md mx-auto py-20 px-4 text-center">
        <h2 className="text-2xl font-bold mb-4">Seu carrinho está vazio</h2>
        <button onClick={() => navigate('/')} className="text-blue-600 font-bold">Voltar para a Loja</button>
      </div>
    );
  }

  const handleFinish = async () => {
    setIsProcessing(true);
    
    const mockOrder: Order = {
      id: Math.random().toString(36).substr(2, 9),
      userId: user.id,
      items: cart,
      total,
      paymentMethod: method,
      status: OrderStatus.PENDING,
      createdAt: new Date().toISOString()
    };

    const result = await processPayment(mockOrder, method);
    setPaymentResult(result);
    setIsProcessing(false);
    
    if (result.success) {
      clearCart();
    }
  };

  if (paymentResult) {
    return (
      <div className="max-w-2xl mx-auto py-16 px-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center border-t-8 border-green-500">
          <CheckCircle2 size={64} className="mx-auto text-green-500 mb-6" />
          <h2 className="text-3xl font-black text-gray-900 mb-2">Pedido Recebido!</h2>
          <p className="text-gray-600 mb-8">{paymentResult.message}</p>
          
          {paymentResult.reference && (
            <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 mb-8">
              <span className="text-xs font-bold text-gray-500 uppercase block mb-1">Referência / IBAN</span>
              <span className="text-xl font-mono font-bold text-blue-600 select-all">{paymentResult.reference}</span>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button onClick={() => navigate('/')} className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold">Continuar Comprando</button>
            <button className="bg-gray-100 text-gray-700 px-8 py-3 rounded-xl font-bold">Minhas Compras</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-black mb-8">Finalizar Checkout</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Payment Methods */}
          <section className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-lg font-bold mb-6 flex items-center space-x-2">
              <Smartphone className="text-blue-600" size={20} />
              <span>Método de Pagamento</span>
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button 
                onClick={() => setMethod(PaymentMethod.MCX_EXPRESS)}
                className={`p-4 rounded-xl border-2 transition flex flex-col items-center text-center ${method === PaymentMethod.MCX_EXPRESS ? 'border-blue-600 bg-blue-50' : 'border-gray-100 hover:border-gray-200'}`}
              >
                <Smartphone className="mb-2 text-blue-600" />
                <span className="text-sm font-bold">MCX Express</span>
              </button>
              
              <button 
                onClick={() => setMethod(PaymentMethod.CARD_STRIPE)}
                className={`p-4 rounded-xl border-2 transition flex flex-col items-center text-center ${method === PaymentMethod.CARD_STRIPE ? 'border-blue-600 bg-blue-50' : 'border-gray-100 hover:border-gray-200'}`}
              >
                <CreditCard className="mb-2 text-blue-600" />
                <span className="text-sm font-bold">Cartão Visa/MC</span>
              </button>

              <button 
                onClick={() => setMethod(PaymentMethod.TRANSFER_IBAN)}
                className={`p-4 rounded-xl border-2 transition flex flex-col items-center text-center ${method === PaymentMethod.TRANSFER_IBAN ? 'border-blue-600 bg-blue-50' : 'border-gray-100 hover:border-gray-200'}`}
              >
                <Landmark className="mb-2 text-blue-600" />
                <span className="text-sm font-bold">IBAN / Transf.</span>
              </button>
            </div>

            {method === PaymentMethod.MCX_EXPRESS && (
              <div className="mt-6 pt-6 border-t border-gray-100">
                <label className="block text-sm font-bold text-gray-700 mb-2">Número Multicaixa Express (+244)</label>
                <input 
                  type="tel"
                  placeholder="9XX XXX XXX"
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                />
                <p className="mt-2 text-xs text-gray-500 italic">Uma notificação será enviada para o seu dispositivo após confirmar.</p>
              </div>
            )}
          </section>

          {/* Delivery Info */}
          <section className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-lg font-bold mb-6">Informações de Entrega</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input type="text" placeholder="Nome Completo" className="p-3 bg-gray-50 border border-gray-200 rounded-lg outline-none" defaultValue={user.name} />
              <input type="text" placeholder="Telefone de Contacto" className="p-3 bg-gray-50 border border-gray-200 rounded-lg outline-none" />
              <input type="text" placeholder="Província (ex: Luanda)" className="p-3 bg-gray-50 border border-gray-200 rounded-lg outline-none col-span-1 md:col-span-2" />
              <textarea placeholder="Endereço detalhado / Ponto de referência" className="p-3 bg-gray-50 border border-gray-200 rounded-lg outline-none col-span-1 md:col-span-2 h-24" />
            </div>
          </section>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-gray-900 text-white rounded-2xl p-6 sticky top-24 shadow-lg">
            <h2 className="text-xl font-bold mb-6 border-b border-gray-700 pb-4">Resumo do Pedido</h2>
            
            <div className="space-y-4 mb-8 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
              {cart.map(item => (
                <div key={item.id} className="flex justify-between items-center text-sm">
                  <div className="flex flex-col">
                    <span className="font-medium line-clamp-1">{item.name}</span>
                    <span className="text-gray-500">Qtd: {item.quantity}</span>
                  </div>
                  <span className="font-bold">{(item.price * item.quantity).toLocaleString()} Kz</span>
                </div>
              ))}
            </div>

            <div className="space-y-3 border-t border-gray-700 pt-6 mb-8">
              <div className="flex justify-between text-gray-400">
                <span>Subtotal</span>
                <span>{total.toLocaleString()} Kz</span>
              </div>
              <div className="flex justify-between text-gray-400">
                <span>Taxa de Entrega</span>
                <span className="text-green-500 font-bold uppercase text-xs">Grátis</span>
              </div>
              <div className="flex justify-between text-xl font-black pt-2">
                <span>TOTAL</span>
                <span className="text-blue-400">{total.toLocaleString()} Kz</span>
              </div>
            </div>

            <button 
              onClick={handleFinish}
              disabled={isProcessing}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-xl font-black text-lg transition flex items-center justify-center space-x-2 shadow-lg shadow-blue-900/40"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="animate-spin" />
                  <span>Processando...</span>
                </>
              ) : (
                <span>Confirmar Pagamento</span>
              )}
            </button>
            <p className="text-center text-[10px] text-gray-500 mt-4 uppercase tracking-widest font-bold">Ambiente de Pagamento Seguro</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;

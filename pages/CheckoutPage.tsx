
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreditCard, Smartphone, Landmark, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { CartItem, User, PaymentMethod, Order, OrderStatus } from '../types';
import { processPayment } from '../services/paymentService';

interface CheckoutPageProps {
  cart: CartItem[];
  user: User | null;
  clearCart: () => void;
  onOrderComplete: (order: Order) => void;
}

const CheckoutPage: React.FC<CheckoutPageProps> = ({ cart, user, clearCart, onOrderComplete }) => {
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
      id: 'ORD-' + Math.random().toString(36).substr(2, 6).toUpperCase(),
      userId: user.id,
      items: [...cart],
      total,
      paymentMethod: method,
      status: OrderStatus.PAID,
      createdAt: new Date().toISOString()
    };

    const result = await processPayment(mockOrder, method);
    
    if (result.success) {
      setPaymentResult(result);
      onOrderComplete(mockOrder);
      clearCart();
    } else {
      setPaymentResult(result);
    }
    setIsProcessing(false);
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
            <button onClick={() => navigate('/')} className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold uppercase text-sm tracking-widest">Continuar Comprando</button>
            <button onClick={() => navigate('/profile')} className="bg-gray-100 text-gray-700 px-8 py-3 rounded-xl font-bold uppercase text-sm tracking-widest">Ver Meus Pedidos</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-black mb-8 uppercase tracking-tight">Finalizar Compra</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <section className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
            <h2 className="text-lg font-black mb-6 flex items-center space-x-2 uppercase tracking-tight text-gray-900">
              {/* Fix: Replaced 'स्मार्टफोन' with 'Smartphone' icon */}
              <Smartphone className="text-blue-600" size={20} />
              <span>Escolha o Pagamento</span>
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button 
                onClick={() => setMethod(PaymentMethod.MCX_EXPRESS)}
                className={`p-6 rounded-2xl border-2 transition flex flex-col items-center text-center ${method === PaymentMethod.MCX_EXPRESS ? 'border-blue-600 bg-blue-50' : 'border-gray-100 hover:border-gray-200'}`}
              >
                {/* Fix: Replaced 'स्मार्टफोन' with 'Smartphone' icon */}
                <Smartphone className="mb-3 text-blue-600" size={32} />
                <span className="text-sm font-black uppercase tracking-widest">MCX Express</span>
              </button>

              <button 
                onClick={() => setMethod(PaymentMethod.TRANSFER_IBAN)}
                className={`p-6 rounded-2xl border-2 transition flex flex-col items-center text-center ${method === PaymentMethod.TRANSFER_IBAN ? 'border-blue-600 bg-blue-50' : 'border-gray-100 hover:border-gray-200'}`}
              >
                <Landmark className="mb-3 text-blue-600" size={32} />
                <span className="text-sm font-black uppercase tracking-widest">IBAN / Transf.</span>
              </button>
            </div>

            {method === PaymentMethod.MCX_EXPRESS && (
              <div className="mt-8 pt-8 border-t border-gray-100 animate-in fade-in slide-in-from-top-2">
                <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-3">Telemóvel Multicaixa Express</label>
                <div className="flex space-x-2">
                   <div className="bg-gray-100 px-4 py-3 rounded-xl font-bold text-gray-500 flex items-center">+244</div>
                   <input 
                    type="tel"
                    placeholder="9XX XXX XXX"
                    className="flex-grow p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none font-bold text-lg"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                  />
                </div>
              </div>
            )}
          </section>

          <section className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
            <h2 className="text-lg font-black mb-6 uppercase tracking-tight">Morada de Entrega</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input type="text" placeholder="Nome para Entrega" className="p-4 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 font-medium" defaultValue={user.name} />
              <input type="text" placeholder="Contacto Urgente" className="p-4 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 font-medium" />
              <input type="text" placeholder="Cidade / Província" className="p-4 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 font-medium col-span-1 md:col-span-2" />
              <textarea placeholder="Ponto de referência e detalhes..." className="p-4 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 h-24 col-span-1 md:col-span-2 font-medium" />
            </div>
          </section>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-gray-900 text-white rounded-3xl p-8 sticky top-24 shadow-2xl">
            <h2 className="text-xl font-black mb-6 border-b border-gray-800 pb-4 uppercase tracking-tighter">Resumo Final</h2>
            
            <div className="space-y-4 mb-8 max-h-64 overflow-y-auto pr-2 custom-scrollbar text-sm font-medium">
              {cart.map(item => (
                <div key={item.id} className="flex justify-between items-center">
                  <span className="truncate mr-4 text-gray-400">{item.name} <span className="text-blue-500">x{item.quantity}</span></span>
                  <span className="font-bold whitespace-nowrap">{(item.price * item.quantity).toLocaleString()} Kz</span>
                </div>
              ))}
            </div>

            <div className="space-y-3 border-t border-gray-800 pt-6 mb-8">
              <div className="flex justify-between text-gray-500 font-bold uppercase text-[10px] tracking-widest">
                <span>Subtotal</span>
                <span>{total.toLocaleString()} Kz</span>
              </div>
              <div className="flex justify-between text-2xl font-black pt-2">
                <span className="uppercase tracking-tighter">Total</span>
                <span className="text-blue-500">{total.toLocaleString()} Kz</span>
              </div>
            </div>

            <button 
              onClick={handleFinish}
              disabled={isProcessing}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-5 rounded-2xl font-black text-lg transition flex items-center justify-center space-x-3 shadow-xl shadow-blue-900/40 transform active:scale-95"
            >
              {isProcessing ? <Loader2 className="animate-spin" /> : <><CheckCircle2 size={24} /><span className="uppercase tracking-widest text-sm">Pagar Agora</span></>}
            </button>
            <p className="text-center text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-6">Ambiente de Pagamento Seguro</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;

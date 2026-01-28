
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, ChevronLeft } from 'lucide-react';
import { CartItem } from '../types';

interface CartPageProps {
  cart: CartItem[];
  updateQuantity: (id: string, qty: number) => void;
  removeFromCart: (id: string) => void;
}

const CartPage: React.FC<CartPageProps> = ({ cart, updateQuantity, removeFromCart }) => {
  const navigate = useNavigate();
  const subtotal = cart.reduce((acc, i) => acc + (i.price * i.quantity), 0);

  if (cart.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <div className="bg-white p-12 rounded-3xl shadow-sm border border-gray-100 inline-block max-w-lg">
          <ShoppingBag size={48} className="mx-auto text-gray-200 mb-6" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">O seu cesto está vazio</h2>
          <p className="text-gray-500 mb-8">Comece a adicionar peças ao seu cesto para finalizar a compra.</p>
          <Link to="/catalog" className="inline-flex bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 transition">
            Ir para o Catálogo
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-black text-gray-900 mb-8 uppercase tracking-tight">O Meu Cesto</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 divide-y divide-gray-50">
              {cart.map(item => (
                <div key={item.id} className="py-6 first:pt-0 last:pb-0 flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6">
                  <div className="w-24 h-24 bg-gray-50 rounded-xl overflow-hidden flex-shrink-0 border border-gray-100">
                    <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-grow">
                    <h3 className="font-bold text-gray-900 text-lg leading-tight mb-1">{item.name}</h3>
                    <p className="text-xs font-bold text-blue-600 uppercase mb-2">{item.brand}</p>
                    <div className="text-lg font-black text-gray-900">
                      {item.price.toLocaleString()} Kz
                    </div>
                  </div>
                  <div className="flex flex-col items-center sm:items-end space-y-3">
                    <div className="flex items-center bg-gray-50 p-1 rounded-lg border border-gray-100">
                      <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="p-1 hover:text-blue-600 transition"><Minus size={16} /></button>
                      <span className="w-10 text-center font-bold">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="p-1 hover:text-blue-600 transition"><Plus size={16} /></button>
                    </div>
                    <button onClick={() => removeFromCart(item.id)} className="text-red-500 hover:text-red-600 text-xs font-bold flex items-center space-x-1">
                      <Trash2 size={14} />
                      <span>Remover</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 sticky top-24">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Resumo da Encomenda</h2>
            <div className="space-y-4 mb-6">
              <div className="flex justify-between text-gray-500 font-medium">
                <span>Subtotal</span>
                <span>{subtotal.toLocaleString()} Kz</span>
              </div>
              <div className="flex justify-between text-gray-500 font-medium">
                <span>Portes</span>
                <span className="text-green-600 font-bold">Grátis</span>
              </div>
              <div className="pt-4 border-t border-gray-100 flex justify-between items-center">
                <span className="text-lg font-bold text-gray-900">Total</span>
                <span className="text-2xl font-black text-blue-600">{subtotal.toLocaleString()} Kz</span>
              </div>
            </div>
            <button 
              onClick={() => navigate('/checkout')}
              className="w-full bg-blue-600 text-white font-bold py-4 rounded-xl flex items-center justify-center space-x-2 hover:bg-blue-700 transition shadow-lg shadow-blue-100"
            >
              <span>Finalizar Compra</span>
              <ArrowRight size={20} />
            </button>
            <div className="mt-4 text-center">
              <Link to="/catalog" className="text-sm font-bold text-gray-400 hover:text-blue-600 flex items-center justify-center space-x-1">
                <ChevronLeft size={16} />
                <span>Continuar Compras</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;

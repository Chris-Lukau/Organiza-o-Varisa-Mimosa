
import React, { useState } from 'react';
// Fix: Re-importing useNavigate to fix module resolution error
import { useNavigate } from 'react-router-dom';
import { Mail, Phone, Lock, Chrome, Loader2, ArrowRight } from 'lucide-react';
import { User } from '../types';

interface AuthPageProps {
  setUser: (user: User) => void;
}

const AuthPage: React.FC<AuthPageProps> = ({ setUser }) => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [method, setMethod] = useState<'email' | 'phone'>('email');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simular autenticação
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const mockUser: User = {
      id: 'usr-' + Math.random().toString(36).substr(2, 4),
      name: isLogin ? 'João Manuel' : 'Novo Utilizador',
      email: 'user@example.com',
      role: 'admin' // Definido como admin para facilitar testes do painel
    };
    
    localStorage.setItem('user', JSON.stringify(mockUser));
    setUser(mockUser);
    setLoading(false);
    navigate('/');
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
        <div className="bg-gray-900 py-8 px-6 text-center">
          <h2 className="text-3xl font-black text-white">{isLogin ? 'Bem-vindo de volta' : 'Crie sua conta'}</h2>
          <p className="text-gray-400 mt-2">{isLogin ? 'Acesse seu painel e pedidos' : 'Junte-se à maior rede de autopeças'}</p>
        </div>

        <div className="p-8">
          {/* Method Switcher */}
          <div className="flex bg-gray-50 rounded-xl p-1 mb-8">
            <button 
              onClick={() => setMethod('email')}
              className={`flex-1 py-2 rounded-lg text-sm font-bold transition ${method === 'email' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-400'}`}
            >
              Email
            </button>
            <button 
              onClick={() => setMethod('phone')}
              className={`flex-1 py-2 rounded-lg text-sm font-bold transition ${method === 'phone' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-400'}`}
            >
              Telefone (+244)
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {method === 'email' ? (
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input 
                  required
                  type="email" 
                  placeholder="Seu email" 
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition"
                />
              </div>
            ) : (
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input 
                  required
                  type="tel" 
                  placeholder="Ex: 923 000 000" 
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition"
                />
              </div>
            )}

            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input 
                required
                type="password" 
                placeholder="Palavra-passe" 
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition"
              />
            </div>

            <button 
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl flex items-center justify-center space-x-2 transition"
            >
              {loading ? <Loader2 className="animate-spin" /> : (
                <>
                  <span>{isLogin ? 'Entrar Agora' : 'Finalizar Cadastro'}</span>
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200"></div></div>
            <div className="relative flex justify-center text-xs uppercase"><span className="bg-white px-2 text-gray-500 font-bold">Ou continue com</span></div>
          </div>

          <button className="w-full border border-gray-200 hover:bg-gray-50 text-gray-700 font-bold py-3 rounded-xl flex items-center justify-center space-x-2 transition">
            <Chrome size={20} />
            <span>Google Workspace</span>
          </button>

          <div className="mt-8 text-center text-sm text-gray-500">
            {isLogin ? (
              <p>Não tem uma conta? <button onClick={() => setIsLogin(false)} className="text-blue-600 font-bold hover:underline">Registe-se aqui</button></p>
            ) : (
              <p>Já possui conta? <button onClick={() => setIsLogin(true)} className="text-blue-600 font-bold hover:underline">Fazer login</button></p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;

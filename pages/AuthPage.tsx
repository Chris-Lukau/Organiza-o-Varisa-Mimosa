
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// Fix: Added User as UserIcon to lucide-react imports
import { Mail, Phone, Lock, Chrome, Loader2, ArrowRight, Zap, User as UserIcon } from 'lucide-react';
import { User } from '../types';

interface AuthPageProps {
  setUser: (user: User) => void;
}

const AuthPage: React.FC<AuthPageProps> = ({ setUser }) => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [method, setMethod] = useState<'email' | 'phone'>('email');
  
  // States para campos
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleDemoCredentials = (role: 'admin' | 'customer') => {
    setMethod('email');
    if (role === 'admin') {
      setEmail('admin.pro@autopecas.ao');
      setPassword('admin123');
    } else {
      setEmail('cliente.demo@email.ao');
      setPassword('cliente123');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simular autenticação real
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const isDemoAdmin = email === 'admin.pro@autopecas.ao';
    
    const mockUser: User = {
      id: 'usr-' + Math.random().toString(36).substr(2, 4),
      name: isDemoAdmin ? 'Administrador Central' : 'João Manuel',
      email: email || 'user@example.com',
      role: isDemoAdmin ? 'admin' : 'customer'
    };
    
    localStorage.setItem('user', JSON.stringify(mockUser));
    setUser(mockUser);
    setLoading(false);
    navigate(isDemoAdmin ? '/admin' : '/profile');
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
        <div className="bg-gray-900 py-8 px-6 text-center">
          <h2 className="text-3xl font-black text-white">{isLogin ? 'Acesso ao Portal' : 'Crie sua conta'}</h2>
          <p className="text-gray-400 mt-2">{isLogin ? 'Gerencie suas compras e perfil' : 'Junte-se à maior rede de autopeças'}</p>
        </div>

        <div className="p-8">
          {isLogin && (
            <div className="grid grid-cols-2 gap-3 mb-8">
               <button 
                onClick={() => handleDemoCredentials('admin')}
                className="flex items-center justify-center space-x-2 bg-blue-50 text-blue-700 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-100 transition border border-blue-200"
               >
                 <Zap size={14} />
                 <span>Demo Admin</span>
               </button>
               <button 
                onClick={() => handleDemoCredentials('customer')}
                className="flex items-center justify-center space-x-2 bg-gray-50 text-gray-700 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-gray-100 transition border border-gray-200"
               >
                 {/* Fix: Replaced User (type) with UserIcon (lucide-react component) */}
                 <UserIcon size={14} />
                 <span>Demo Cliente</span>
               </button>
            </div>
          )}

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
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition font-medium"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                />
              </div>
            ) : (
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input 
                  required
                  type="tel" 
                  placeholder="Ex: 923 000 000" 
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition font-medium"
                />
              </div>
            )}

            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input 
                required
                type="password" 
                placeholder="Palavra-passe" 
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition font-medium"
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
            </div>

            <button 
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-4 rounded-xl flex items-center justify-center space-x-2 transition shadow-xl shadow-blue-100"
            >
              {loading ? <Loader2 className="animate-spin" /> : (
                <>
                  <span className="uppercase tracking-widest text-sm">{isLogin ? 'Entrar Agora' : 'Finalizar Cadastro'}</span>
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

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

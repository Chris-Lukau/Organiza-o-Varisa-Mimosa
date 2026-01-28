
import React from 'react';
import { Navigate, Link } from 'react-router-dom';
import { User as UserIcon, Package, Clock, Shield, ChevronRight, Inbox, Mail, Phone, Calendar } from 'lucide-react';
import { User, Order } from '../types';

interface ProfilePageProps {
  user: User | null;
  orders: Order[];
}

const ProfilePage: React.FC<ProfilePageProps> = ({ user, orders }) => {
  if (!user) return <Navigate to="/auth" />;

  const userOrders = orders.filter(o => o.userId === user.id);

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        
        {/* Sidebar Informações do Usuário */}
        <aside className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="bg-gray-900 h-24"></div>
            <div className="px-8 pb-8 -mt-12">
              <div className="w-24 h-24 bg-blue-600 rounded-3xl border-4 border-white flex items-center justify-center text-white shadow-xl mb-4">
                <UserIcon size={40} />
              </div>
              <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tighter">{user.name}</h2>
              <p className="text-xs font-black text-blue-600 uppercase tracking-widest mt-1">Cliente VIP AutoPeças</p>
              
              <div className="mt-8 space-y-4">
                <div className="flex items-center space-x-3 text-gray-600">
                  <div className="p-2 bg-gray-50 rounded-lg"><Mail size={16} /></div>
                  <span className="text-sm font-bold">{user.email}</span>
                </div>
                {user.phone && (
                  <div className="flex items-center space-x-3 text-gray-600">
                    <div className="p-2 bg-gray-50 rounded-lg"><Phone size={16} /></div>
                    <span className="text-sm font-bold">{user.phone}</span>
                  </div>
                )}
                 <div className="flex items-center space-x-3 text-gray-600">
                  <div className="p-2 bg-gray-50 rounded-lg"><Calendar size={16} /></div>
                  <span className="text-sm font-bold">Membro desde Out/2023</span>
                </div>
              </div>

              <div className="mt-10 pt-8 border-t border-gray-50">
                <Link to="/contact" className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-blue-50 text-gray-900 hover:text-blue-600 rounded-2xl transition font-black text-[10px] uppercase tracking-[0.2em] group">
                  <span>Suporte Especializado</span>
                  <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          </div>

          <div className="bg-blue-600 rounded-3xl p-8 text-white shadow-xl shadow-blue-900/20">
             <Shield className="mb-4" size={32} />
             <h3 className="text-xl font-black uppercase tracking-tight">Garantia Pro</h3>
             <p className="text-blue-100 text-sm mt-2 leading-relaxed font-medium">Todas as suas encomendas beneficiam de 1 ano de garantia certificada em Angola.</p>
          </div>
        </aside>

        {/* Histórico de Encomendas */}
        <div className="lg:col-span-2 space-y-8">
           <div className="flex items-center justify-between">
              <h1 className="text-3xl font-black text-gray-900 uppercase tracking-tight">Histórico de Compras</h1>
              <span className="bg-gray-100 px-4 py-1.5 rounded-full text-[10px] font-black text-gray-500 uppercase tracking-widest">{userOrders.length} Pedidos</span>
           </div>

           {userOrders.length > 0 ? (
             <div className="space-y-6">
                {userOrders.map((order) => (
                  <div key={order.id} className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden group hover:shadow-lg transition-all">
                    <div className="p-6 md:p-8 flex flex-col md:flex-row justify-between md:items-center gap-6">
                       <div className="flex items-center space-x-6">
                          <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center text-blue-600 border border-gray-100 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                             <Package size={28} />
                          </div>
                          <div>
                             <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Encomenda #{order.id}</p>
                             <h4 className="text-lg font-black text-gray-900 mt-1">{order.items.length} Componentes Automotivos</h4>
                             <div className="flex items-center space-x-3 mt-2">
                                <span className="flex items-center space-x-1 text-gray-500 text-xs font-bold">
                                   <Clock size={14} />
                                   <span>{new Date(order.createdAt).toLocaleDateString('pt-PT')}</span>
                                </span>
                                <span className="px-2 py-0.5 bg-green-100 text-green-700 text-[9px] font-black uppercase tracking-widest rounded-md">Entregue</span>
                             </div>
                          </div>
                       </div>
                       <div className="flex flex-col md:items-end">
                          <span className="text-2xl font-black text-gray-900">{order.total.toLocaleString()} Kz</span>
                          <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">{order.paymentMethod}</span>
                       </div>
                    </div>
                    
                    {/* Lista de itens expansível visualmente */}
                    <div className="px-8 pb-8 pt-2 grid grid-cols-2 md:grid-cols-4 gap-4">
                       {order.items.slice(0, 4).map((item, idx) => (
                         <div key={idx} className="flex items-center space-x-2 bg-gray-50 p-2 rounded-xl border border-gray-100">
                            <img src={item.imageUrl} className="w-8 h-8 rounded-lg object-cover" alt={item.name} />
                            <span className="text-[10px] font-bold text-gray-600 truncate">{item.name}</span>
                         </div>
                       ))}
                    </div>
                  </div>
                ))}
             </div>
           ) : (
             <div className="bg-white rounded-[40px] p-24 text-center border-2 border-dashed border-gray-100">
                <Inbox size={64} className="mx-auto text-gray-200 mb-6" />
                <h3 className="text-xl font-black text-gray-900 uppercase">Sem Encomendas</h3>
                <p className="text-gray-500 font-medium mt-2 max-w-sm mx-auto">Ainda não realizou nenhuma compra no nosso portal. Explore o nosso catálogo para encontrar as melhores peças.</p>
                <Link to="/catalog" className="inline-flex mt-8 bg-blue-600 text-white px-10 py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-blue-700 transition shadow-xl shadow-blue-100">
                  Explorar Catálogo
                </Link>
             </div>
           )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;

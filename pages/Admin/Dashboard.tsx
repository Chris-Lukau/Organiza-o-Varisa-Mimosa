
import React, { useState, useEffect, useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, Users, DollarSign, ShoppingBag, Download, RefreshCw, Zap, Inbox, AlertTriangle } from 'lucide-react';
import { getStoreInsights } from '../../services/geminiService';
import { Order, OrderStatus, Product } from '../../types';

interface AdminDashboardProps {
  orders: Order[];
  products: Product[];
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ orders, products }) => {
  const [insights, setInsights] = useState<string>('');
  const [loadingInsights, setLoadingInsights] = useState(false);

  // Produtos com stock baixo
  const lowStockProducts = useMemo(() => {
    return products.filter(p => p.stock <= (p.minStockThreshold ?? 5));
  }, [products]);

  const stats = useMemo(() => {
    const paidOrders = orders.filter(o => o.status === OrderStatus.PAID);
    const revenue = paidOrders.reduce((acc, o) => acc + o.total, 0);
    
    // Agrupar vendas por dia para o gráfico
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (6 - i));
      return {
        name: d.toLocaleDateString('pt-PT', { weekday: 'short' }),
        date: d.toDateString(),
        rev: 0
      };
    });

    paidOrders.forEach(o => {
      const oDate = new Date(o.createdAt).toDateString();
      const day = last7Days.find(d => d.date === oDate);
      if (day) day.rev += o.total;
    });

    return {
      revenue,
      totalSales: paidOrders.length,
      graphData: last7Days,
      recent: orders.slice(0, 5)
    };
  }, [orders]);

  useEffect(() => {
    if (orders.length > 0) fetchInsights();
  }, [orders.length]);

  const fetchInsights = async () => {
    setLoadingInsights(true);
    const text = await getStoreInsights(stats.graphData);
    setInsights(text);
    setLoadingInsights(false);
  };

  const handleExportPDF = () => {
    window.print();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-black text-gray-900 uppercase">Painel Geral</h1>
          <p className="text-gray-500">Métricas em tempo real baseadas em vendas reais.</p>
        </div>
        <div className="flex space-x-3 print:hidden">
          <button 
            onClick={handleExportPDF}
            className="bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-gray-50 transition font-bold"
          >
            <Download size={18} />
            <span>Exportar PDF</span>
          </button>
          <button 
            onClick={fetchInsights}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-700 transition font-bold"
          >
            <RefreshCw size={18} className={loadingInsights ? 'animate-spin' : ''} />
            <span>Sincronizar IA</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl w-fit mb-4"><DollarSign size={24} /></div>
          <p className="text-gray-500 text-xs font-black uppercase tracking-widest">Receita Total</p>
          <h3 className="text-2xl font-black text-gray-900 mt-1">{stats.revenue.toLocaleString()} Kz</h3>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="p-3 bg-purple-50 text-purple-600 rounded-xl w-fit mb-4"><ShoppingBag size={24} /></div>
          <p className="text-gray-500 text-xs font-black uppercase tracking-widest">Vendas Concluídas</p>
          <h3 className="text-2xl font-black text-gray-900 mt-1">{stats.totalSales}</h3>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="p-3 bg-orange-50 text-orange-600 rounded-xl w-fit mb-4"><AlertTriangle size={24} /></div>
          <p className="text-gray-500 text-xs font-black uppercase tracking-widest">Alertas de Stock</p>
          <h3 className="text-2xl font-black text-orange-600 mt-1">{lowStockProducts.length}</h3>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="p-3 bg-green-50 text-green-600 rounded-xl w-fit mb-4"><TrendingUp size={24} /></div>
          <p className="text-gray-500 text-xs font-black uppercase tracking-widest">Conversão</p>
          <h3 className="text-2xl font-black text-gray-900 mt-1">{stats.totalSales > 0 ? '100%' : '0%'}</h3>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="font-bold text-gray-900 mb-6 uppercase text-xs tracking-widest">Histórico de Receita (7 Dias)</h3>
          {/* Fix: explicit min-height to avoid Recharts height warnings and ensure proper rendering */}
          <div className="h-80 min-h-[320px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats.graphData}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10}} />
                <YAxis hide />
                <Tooltip />
                <Area type="monotone" dataKey="rev" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col h-full">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-gray-900 uppercase text-xs tracking-widest">Avisos de Reposição</h3>
            <AlertTriangle size={18} className="text-orange-500" />
          </div>
          <div className="flex-grow overflow-y-auto max-h-[280px] space-y-3 pr-2 custom-scrollbar">
            {lowStockProducts.length > 0 ? (
              lowStockProducts.map(p => (
                <div key={p.id} className="flex items-center justify-between p-3 bg-orange-50 rounded-xl border border-orange-100">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0">
                      <img src={p.imageUrl} className="w-full h-full object-cover" alt={p.name} />
                    </div>
                    <div>
                      <div className="text-xs font-black text-gray-900 leading-tight">{p.name}</div>
                      <div className="text-[10px] font-bold text-orange-600 uppercase">Stock: {p.stock} UN</div>
                    </div>
                  </div>
                  <div className="text-[8px] font-black bg-orange-200 text-orange-800 px-2 py-1 rounded uppercase">Repor</div>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-10 opacity-30">
                <Inbox size={48} className="mb-2" />
                <p className="text-[10px] font-black uppercase tracking-widest text-center">Nenhum produto em rutura</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col h-full">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-gray-900 uppercase text-xs tracking-widest">Insights Inteligentes</h3>
            <Zap size={18} className="text-blue-600" />
          </div>
          <div className="flex-grow flex flex-col justify-center bg-gray-50 rounded-xl p-6 border border-gray-100 min-h-[160px]">
            {loadingInsights ? (
              <div className="space-y-4">
                <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded animate-pulse w-full"></div>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-gray-600 leading-relaxed text-sm italic">
                  {orders.length === 0 
                    ? "Aguardando as primeiras vendas para gerar análise preditiva." 
                    : insights || "Clique em sincronizar para atualizar a análise."}
                </p>
                <div className="pt-4 mt-4 border-t border-gray-200">
                  <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Gemini 3 Pro Analytics</span>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col h-full">
          <div className="p-6 border-b border-gray-100 flex justify-between items-center">
            <h3 className="font-bold text-gray-900 uppercase text-xs tracking-widest">Vendas Recentes</h3>
          </div>
          {stats.recent.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-gray-50 text-gray-400 text-[10px] font-black uppercase tracking-widest">
                  <tr>
                    <th className="px-6 py-4">ID Pedido</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {stats.recent.map((o) => (
                    <tr key={o.id} className="hover:bg-gray-50 transition">
                      <td className="px-6 py-4 font-mono font-bold text-blue-600">{o.id}</td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-1 rounded-full text-[10px] font-black uppercase bg-green-100 text-green-700">PAGO</span>
                      </td>
                      <td className="px-6 py-4 text-right font-black">{o.total.toLocaleString()} Kz</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-20 text-center flex-grow flex flex-col items-center justify-center">
              <Inbox className="mx-auto text-gray-200 mb-4" size={48} />
              <p className="text-gray-500 font-bold uppercase text-[10px] tracking-widest">Nenhuma venda registada</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

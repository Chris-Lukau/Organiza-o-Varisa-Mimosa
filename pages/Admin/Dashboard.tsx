
import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, AreaChart, Area } from 'recharts';
import { TrendingUp, Users, DollarSign, ShoppingBag, Download, RefreshCw, Zap } from 'lucide-react';
import { getStoreInsights } from '../../services/geminiService';

const MOCK_SALES_DATA = [
  { name: 'Seg', sales: 45, rev: 120000 },
  { name: 'Ter', sales: 52, rev: 180000 },
  { name: 'Qua', sales: 48, rev: 150000 },
  { name: 'Qui', sales: 70, rev: 320000 },
  { name: 'Sex', sales: 90, rev: 450000 },
  { name: 'Sab', sales: 110, rev: 680000 },
  { name: 'Dom', sales: 65, rev: 210000 },
];

const AdminDashboard: React.FC = () => {
  const [insights, setInsights] = useState<string>('');
  const [loadingInsights, setLoadingInsights] = useState(false);

  useEffect(() => {
    fetchInsights();
  }, []);

  const fetchInsights = async () => {
    setLoadingInsights(true);
    const text = await getStoreInsights(MOCK_SALES_DATA);
    setInsights(text);
    setLoadingInsights(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-black text-gray-900">Painel Geral</h1>
          <p className="text-gray-500">Métricas consolidadas da sua loja de autopeças.</p>
        </div>
        <div className="flex space-x-3">
          <button className="bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-gray-50 transition">
            <Download size={18} />
            <span>Exportar PDF</span>
          </button>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-700 transition">
            <RefreshCw size={18} />
            <span>Sincronizar</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-xl"><DollarSign size={24} /></div>
            <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded">+12.5%</span>
          </div>
          <p className="text-gray-500 text-sm font-medium">Receita Total</p>
          <h3 className="text-2xl font-black text-gray-900 mt-1">2.110.000 Kz</h3>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-purple-50 text-purple-600 rounded-xl"><ShoppingBag size={24} /></div>
            <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded">+8%</span>
          </div>
          <p className="text-gray-500 text-sm font-medium">Total de Vendas</p>
          <h3 className="text-2xl font-black text-gray-900 mt-1">480 Pedidos</h3>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-orange-50 text-orange-600 rounded-xl"><Users size={24} /></div>
            <span className="text-xs font-bold text-red-600 bg-red-50 px-2 py-1 rounded">-2.1%</span>
          </div>
          <p className="text-gray-500 text-sm font-medium">Visitantes</p>
          <h3 className="text-2xl font-black text-gray-900 mt-1">12.402</h3>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-green-50 text-green-600 rounded-xl"><TrendingUp size={24} /></div>
            <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded">3.8%</span>
          </div>
          <p className="text-gray-500 text-sm font-medium">Conversão Checkout</p>
          <h3 className="text-2xl font-black text-gray-900 mt-1">4.2%</h3>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="font-bold text-gray-900 mb-6">Desempenho de Vendas (Semana)</h3>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={MOCK_SALES_DATA}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <YAxis hide />
                <Tooltip />
                <Area type="monotone" dataKey="rev" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-gray-900">AI Store Insights</h3>
            <button onClick={fetchInsights} className="text-blue-600 p-1 hover:bg-blue-50 rounded transition">
              <RefreshCw size={18} className={loadingInsights ? 'animate-spin' : ''} />
            </button>
          </div>
          <div className="flex-grow flex flex-col justify-center bg-gray-50 rounded-xl p-6 border border-gray-100">
            {loadingInsights ? (
              <div className="space-y-4">
                <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded animate-pulse w-full"></div>
                <div className="h-4 bg-gray-200 rounded animate-pulse w-5/6"></div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center space-x-2 text-blue-600 font-bold text-sm">
                  <Zap size={20} />
                  <span>RECOMENDAÇÕES ESTRATÉGICAS</span>
                </div>
                <p className="text-gray-600 leading-relaxed text-sm italic">{insights || "Clique em sincronizar para obter análise preditiva da IA."}</p>
                <div className="pt-4 mt-4 border-t border-gray-200">
                  <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Alimentado por Gemini 3 Flash</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Metrics Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
          <h3 className="font-bold text-gray-900">Vendas Recentes</h3>
          <button className="text-blue-600 text-sm font-bold hover:underline">Ver todas</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-gray-500 text-xs font-bold uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4">ID Pedido</th>
                <th className="px-6 py-4">Cliente</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Método</th>
                <th className="px-6 py-4">Data</th>
                <th className="px-6 py-4 text-right">Valor</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {[
                { id: '#45290', client: 'Alberto G.', status: 'Pago', method: 'MCX Express', date: 'Hoje, 14:22', val: '85.000 Kz' },
                { id: '#45289', client: 'Teresa M.', status: 'Pendente', method: 'IBAN', date: 'Hoje, 13:10', val: '120.000 Kz' },
                { id: '#45288', client: 'Luís N.', status: 'Pago', method: 'Visa', date: 'Ontem, 18:45', val: '45.000 Kz' },
                { id: '#45287', client: 'Maria J.', status: 'Cancelado', method: 'MCX Express', date: 'Ontem, 09:12', val: '250.000 Kz' },
              ].map((row, i) => (
                <tr key={i} className="hover:bg-gray-50 transition text-sm">
                  <td className="px-6 py-4 font-mono font-bold text-blue-600">{row.id}</td>
                  <td className="px-6 py-4 font-medium text-gray-900">{row.client}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${
                      row.status === 'Pago' ? 'bg-green-100 text-green-700' : 
                      row.status === 'Pendente' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {row.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-500">{row.method}</td>
                  <td className="px-6 py-4 text-gray-500">{row.date}</td>
                  <td className="px-6 py-4 text-right font-black text-gray-900">{row.val}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

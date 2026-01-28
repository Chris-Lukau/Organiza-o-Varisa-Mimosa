
import React, { useState, useMemo } from 'react';
import { Download, Filter, FileText, Table as TableIcon, DollarSign, Package, PieChart, TrendingUp, Inbox } from 'lucide-react';
import { PaymentMethod, OrderStatus, Order } from '../../types';

interface AdminReportsProps {
  orders: Order[];
}

const AdminReports: React.FC<AdminReportsProps> = ({ orders }) => {
  const [period, setPeriod] = useState<'daily' | 'weekly' | 'monthly' | 'all'>('all');
  const [methodFilter, setMethodFilter] = useState<string>('all');

  const filteredOrders = useMemo(() => {
    return orders.filter(order => {
      const matchesMethod = methodFilter === 'all' || order.paymentMethod === methodFilter;
      const orderDate = new Date(order.createdAt);
      const now = new Date();
      let matchesPeriod = true;

      if (period === 'daily') {
        matchesPeriod = orderDate.toDateString() === now.toDateString();
      } else if (period === 'weekly') {
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        matchesPeriod = orderDate >= weekAgo;
      } else if (period === 'monthly') {
        matchesPeriod = orderDate.getMonth() === now.getMonth() && orderDate.getFullYear() === now.getFullYear();
      }

      return matchesMethod && matchesPeriod;
    });
  }, [period, methodFilter, orders]);

  const stats = useMemo(() => {
    const total = filteredOrders.reduce((acc, o) => acc + o.total, 0);
    const paid = filteredOrders.filter(o => o.status === OrderStatus.PAID).length;
    return {
      totalRevenue: total,
      totalSales: filteredOrders.length,
      paidOrders: paid,
      averageTicket: filteredOrders.length > 0 ? total / filteredOrders.length : 0
    };
  }, [filteredOrders]);

  const exportToExcel = () => {
    const headers = ["ID", "Data", "Total (Kz)", "Método", "Status"];
    const rows = filteredOrders.map(o => [o.id, new Date(o.createdAt).toLocaleDateString(), o.total, o.paymentMethod, o.status]);
    const csvContent = "data:text/csv;charset=utf-8," 
      + headers.join(",") + "\n"
      + rows.map(e => e.join(",")).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `relatorio_vendas_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportToPDF = () => {
    window.print();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12 print:hidden">
        <div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tight uppercase">Relatórios</h1>
          <p className="text-gray-500 font-medium mt-1">Análise detalhada do seu volume de negócios.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button 
            onClick={exportToExcel}
            className="bg-green-600 text-white px-6 py-3 rounded-xl font-bold flex items-center space-x-2 shadow-lg shadow-green-100 hover:bg-green-700 transition"
          >
            <TableIcon size={18} />
            <span>Excel</span>
          </button>
          <button 
            onClick={exportToPDF}
            className="bg-gray-900 text-white px-6 py-3 rounded-xl font-bold flex items-center space-x-2 shadow-lg shadow-gray-200 hover:bg-black transition"
          >
            <FileText size={18} />
            <span>Exportar PDF</span>
          </button>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 mb-10 flex flex-col md:flex-row gap-6 items-center print:hidden">
        <div className="flex bg-gray-100 p-1 rounded-xl flex-grow md:flex-none">
          {(['all', 'daily', 'weekly', 'monthly'] as const).map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`flex-1 px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition ${period === p ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
            >
              {p === 'all' ? 'Tudo' : p === 'daily' ? 'Hoje' : p === 'weekly' ? 'Semana' : 'Mês'}
            </button>
          ))}
        </div>
        <select 
          className="w-full md:w-64 bg-gray-50 border border-gray-100 rounded-xl py-3 px-4 font-bold text-gray-700 outline-none focus:ring-2 focus:ring-blue-500"
          value={methodFilter}
          onChange={(e) => setMethodFilter(e.target.value)}
        >
          <option value="all">Todos os Métodos</option>
          {Object.values(PaymentMethod).map(m => <option key={m} value={m}>{m}</option>)}
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
          <div className="p-3 bg-blue-50 text-blue-600 w-fit rounded-2xl mb-4"><DollarSign size={24} /></div>
          <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest">Receita Bruta</p>
          <h3 className="text-2xl font-black text-gray-900 mt-1">{stats.totalRevenue.toLocaleString()} Kz</h3>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
          <div className="p-3 bg-purple-50 text-purple-600 w-fit rounded-2xl mb-4"><Package size={24} /></div>
          <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest">Pedidos</p>
          <h3 className="text-2xl font-black text-gray-900 mt-1">{stats.totalSales}</h3>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
          <div className="p-3 bg-green-50 text-green-600 w-fit rounded-2xl mb-4"><PieChart size={24} /></div>
          <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest">Pagos</p>
          <h3 className="text-2xl font-black text-gray-900 mt-1">{stats.paidOrders}</h3>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
          <div className="p-3 bg-orange-50 text-orange-600 w-fit rounded-2xl mb-4"><TrendingUp size={24} /></div>
          <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest">Ticket Médio</p>
          <h3 className="text-2xl font-black text-gray-900 mt-1">{Math.round(stats.averageTicket).toLocaleString()} Kz</h3>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
        <div className="p-8 border-b border-gray-100 flex justify-between items-center">
          <h3 className="font-black text-gray-900 uppercase tracking-tight text-xl">Extrato de Vendas</h3>
          <span className="text-[10px] font-black text-gray-400 uppercase bg-gray-50 px-3 py-1 rounded-full">{filteredOrders.length} Registos</span>
        </div>
        {filteredOrders.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 text-gray-400 text-[10px] font-black uppercase tracking-widest">
                <tr>
                  <th className="px-8 py-5">ID Pedido</th>
                  <th className="px-6 py-5">Data</th>
                  <th className="px-6 py-5">Pagamento</th>
                  <th className="px-6 py-5">Estado</th>
                  <th className="px-8 py-5 text-right">Valor</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredOrders.map(order => (
                  <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-8 py-6 font-black text-blue-600 font-mono text-sm">{order.id}</td>
                    <td className="px-6 py-6 text-gray-500 font-medium text-sm">{new Date(order.createdAt).toLocaleDateString()}</td>
                    <td className="px-6 py-6 text-[10px] font-black text-gray-400 uppercase">{order.paymentMethod}</td>
                    <td className="px-6 py-6">
                      <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter bg-green-100 text-green-700">PAGO</span>
                    </td>
                    <td className="px-8 py-6 text-right font-black text-gray-900 text-lg">
                      {order.total.toLocaleString()} Kz
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-32 text-center">
            <Inbox className="mx-auto text-gray-200 mb-4" size={64} />
            <p className="text-gray-400 font-bold uppercase text-sm tracking-widest">Nenhum dado encontrado para este filtro</p>
          </div>
        )}
      </div>

      <div className="hidden print:block mt-12 text-center text-[8px] text-gray-400 border-t pt-8 uppercase tracking-[0.2em] font-black">
        AutoPeças Pro Angola - Sistema de Gestão Interno - Gerado em {new Date().toLocaleString()}
      </div>
    </div>
  );
};

export default AdminReports;

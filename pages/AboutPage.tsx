
import React from 'react';
import { Award, Shield, Users, Clock } from 'lucide-react';

const AboutPage: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-16">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-6 uppercase tracking-tight">AutoPeças <span className="text-blue-600">Pro</span></h1>
        <p className="text-xl text-gray-600 leading-relaxed">
          Somos a principal referência em fornecimento de componentes automotivos de alta performance em Luanda e em todo o território nacional angolano.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-24">
        <div>
          <img src="https://picsum.photos/seed/garage/800/600" alt="Nossa Oficina" className="rounded-2xl shadow-2xl" />
        </div>
        <div className="space-y-6">
          <h2 className="text-3xl font-bold text-gray-900">Qualidade Sem Compromissos</h2>
          <p className="text-gray-600 leading-relaxed text-lg">
            Desde 2018, temos trabalhado incansavelmente para conectar proprietários de veículos e mecânicos profissionais às melhores peças do mercado global. Nossa rede de logística garante que a sua viatura não fique parada por falta de componentes.
          </p>
          <div className="grid grid-cols-2 gap-6">
            <div className="flex items-start space-x-3">
              <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><Award size={24} /></div>
              <div>
                <h4 className="font-bold">Certificados</h4>
                <p className="text-xs text-gray-500">Parceiros das maiores fabricantes mundiais.</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><Shield size={24} /></div>
              <div>
                <h4 className="font-bold">Segurança</h4>
                <p className="text-xs text-gray-500">Garantia total em todos os componentes.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gray-900 rounded-3xl p-12 text-white">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
          <div>
            <div className="text-4xl font-black text-blue-500 mb-2">50k+</div>
            <div className="text-sm font-bold uppercase tracking-widest text-gray-400">Peças em Stock</div>
          </div>
          <div>
            <div className="text-4xl font-black text-blue-500 mb-2">12k</div>
            <div className="text-sm font-bold uppercase tracking-widest text-gray-400">Clientes Atendidos</div>
          </div>
          <div>
            <div className="text-4xl font-black text-blue-500 mb-2">18</div>
            <div className="text-sm font-bold uppercase tracking-widest text-gray-400">Marcas Parceiras</div>
          </div>
          <div>
            <div className="text-4xl font-black text-blue-500 mb-2">24h</div>
            <div className="text-sm font-bold uppercase tracking-widest text-gray-400">Entrega Expressa</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;

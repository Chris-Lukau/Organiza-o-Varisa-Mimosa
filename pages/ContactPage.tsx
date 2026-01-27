
import React from 'react';
import { Mail, Phone, MapPin, Send, MessageCircle } from 'lucide-react';

const ContactPage: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-16">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
        <div>
          <h1 className="text-4xl font-black text-gray-900 mb-6">Fale Connosco</h1>
          <p className="text-gray-600 mb-12 text-lg">Precisa de ajuda para encontrar a peça certa? Nossa equipa técnica está pronta para lhe prestar todo o apoio necessário.</p>
          
          <div className="space-y-8">
            <div className="flex items-start space-x-4">
              <div className="bg-blue-100 p-4 rounded-2xl text-blue-600"><Phone size={24} /></div>
              <div>
                <h4 className="font-bold text-gray-900">Telefone Comercial</h4>
                <p className="text-gray-600">+244 923 000 000 / +244 222 000 000</p>
                <p className="text-xs text-blue-600 font-bold mt-1">Atendimento das 08h às 18h</p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="bg-green-100 p-4 rounded-2xl text-green-600"><MessageCircle size={24} /></div>
              <div>
                <h4 className="font-bold text-gray-900">WhatsApp Directo</h4>
                <p className="text-gray-600">+244 945 123 456</p>
                <button className="mt-2 text-sm font-bold text-green-600 bg-green-50 px-4 py-2 rounded-lg hover:bg-green-100 transition">Iniciar Conversa</button>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="bg-purple-100 p-4 rounded-2xl text-purple-600"><Mail size={24} /></div>
              <div>
                <h4 className="font-bold text-gray-900">E-mail de Suporte</h4>
                <p className="text-gray-600">suporte@autopecaspro.ao</p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="bg-gray-100 p-4 rounded-2xl text-gray-600"><MapPin size={24} /></div>
              <div>
                <h4 className="font-bold text-gray-900">Sede Principal</h4>
                <p className="text-gray-600">Rua Direita da Samba, Edifício AutoPro, Luanda - Angola</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100">
          <h3 className="text-2xl font-bold mb-6">Envie uma Mensagem</h3>
          <form className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input type="text" placeholder="Seu Nome" className="w-full p-4 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:ring-2 focus:ring-blue-500" />
              <input type="email" placeholder="Seu E-mail" className="w-full p-4 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <input type="text" placeholder="Assunto" className="w-full p-4 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:ring-2 focus:ring-blue-500" />
            <textarea placeholder="Como podemos ajudar?" className="w-full p-4 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 h-40"></textarea>
            <button className="w-full bg-gray-900 hover:bg-black text-white font-bold py-4 rounded-xl flex items-center justify-center space-x-2 transition shadow-lg">
              <Send size={20} />
              <span>Enviar Mensagem</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;

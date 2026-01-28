
import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Search, ChevronRight, ShoppingCart, Package, Box } from 'lucide-react';
import { Product, User } from '../types';

interface HomePageProps {
  products: Product[];
  addToCart: (product: Product) => void;
  user: User | null;
}

const HomePage: React.FC<HomePageProps> = ({ products, addToCart, user }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Todas');

  const isAdmin = user?.role === 'admin';

  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            p.brand.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'Todas' || p.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchTerm, selectedCategory, products]);

  const featuredProducts = filteredProducts.slice(0, 8);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Hero Section */}
      <div className="relative rounded-3xl overflow-hidden mb-12 bg-gray-900 h-64 md:h-[450px] shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-r from-gray-900 via-gray-900/80 to-transparent z-10"></div>
        <img 
          src="https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&q=80&w=1200" 
          alt="Luxury Car Background" 
          className="absolute inset-0 w-full h-full object-cover opacity-50"
        />
        <div className="relative z-20 h-full flex flex-col justify-center px-8 md:px-16 text-white max-w-2xl">
          <h1 className="text-4xl md:text-6xl font-black mb-4 leading-tight">
            Excelência em <br /><span className="text-blue-500">Componentes.</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-300 mb-8 font-medium">
            A maior rede de distribuição de peças premium em Angola. Qualidade certificada e entrega garantida.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link to="/catalog" className="bg-blue-600 hover:bg-blue-700 text-white font-black py-4 px-10 rounded-xl inline-flex items-center space-x-2 transition shadow-lg shadow-blue-900/40 transform active:scale-95">
              <span>Explorar Peças</span>
              <ChevronRight size={20} />
            </Link>
          </div>
        </div>
      </div>

      <div className="flex justify-between items-end mb-8">
        <div>
          <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tight">Novidades em Stock</h2>
          <p className="text-gray-500 font-medium">As últimas peças adicionadas ao nosso inventário.</p>
        </div>
        {products.length > 0 && (
          <Link to="/catalog" className="text-blue-600 font-bold flex items-center space-x-1 hover:underline">
            <span>Ver Catálogo Completo</span>
            <ChevronRight size={16} />
          </Link>
        )}
      </div>

      {featuredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {featuredProducts.map(product => (
            <div key={product.id} className="group bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <Link to={`/product/${product.id}`} className="block overflow-hidden h-56 relative">
                <img 
                  src={product.imageUrl} 
                  alt={product.name} 
                  className="w-full h-full object-cover group-hover:scale-110 transition duration-700"
                />
                {product.stock < 5 && product.stock > 0 && (
                  <span className="absolute top-3 left-3 bg-orange-500 text-white text-[10px] font-black px-2 py-1 rounded uppercase">Últimas Unidades</span>
                )}
              </Link>
              <div className="p-5">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-[10px] font-black text-blue-600 bg-blue-50 px-2 py-1 rounded uppercase tracking-widest">
                    {product.brand}
                  </span>
                </div>
                <Link to={`/product/${product.id}`} className="block text-lg font-bold text-gray-900 mb-2 hover:text-blue-600 transition line-clamp-1">
                  {product.name}
                </Link>
                <div className="flex justify-between items-center pt-2">
                  <span className="text-xl font-black text-gray-900">
                    {product.price.toLocaleString()} Kz
                  </span>
                  
                  {/* Oculta botão de compra para Admin */}
                  {!isAdmin && (
                    <button 
                      onClick={(e) => { e.preventDefault(); addToCart(product); }}
                      disabled={product.stock === 0}
                      className="p-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-200 text-white rounded-xl transition transform active:scale-95"
                    >
                      <ShoppingCart size={20} />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="py-24 text-center bg-white rounded-[40px] border-2 border-dashed border-gray-200 shadow-inner">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-gray-50 rounded-full mb-6 text-gray-300">
            <Box size={48} />
          </div>
          <h3 className="text-2xl font-black text-gray-900 uppercase">Stock em Atualização</h3>
          <p className="text-gray-500 font-medium max-w-md mx-auto mt-4 px-6">
            Estamos a preparar o nosso inventário com as melhores peças do mercado. <br />
            {!isAdmin && <span className="text-blue-600 font-bold">Admin:</span>} Faça login para registar novos produtos.
          </p>
          <div className="mt-8 flex justify-center gap-4">
             {!user && (
               <Link to="/auth" className="bg-gray-900 text-white px-8 py-3 rounded-xl font-bold hover:bg-black transition">
                 Acesso Admin
               </Link>
             )}
          </div>
        </div>
      )}

      {/* Service Highlights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-24">
        <div className="bg-blue-50 p-8 rounded-3xl border border-blue-100">
           <div className="w-12 h-12 bg-blue-600 text-white rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-blue-200">
              <Package size={24} />
           </div>
           <h4 className="text-xl font-black text-gray-900 mb-2">Peças Originais</h4>
           <p className="text-gray-600 text-sm leading-relaxed">Trabalhamos apenas com marcas certificadas para garantir a longevidade da sua viatura.</p>
        </div>
        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
           <div className="w-12 h-12 bg-gray-900 text-white rounded-2xl flex items-center justify-center mb-6 shadow-lg">
              <ShoppingCart size={24} />
           </div>
           <h4 className="text-xl font-black text-gray-900 mb-2">Encomendas Especiais</h4>
           <p className="text-gray-600 text-sm leading-relaxed">Não encontra o que precisa? Nossa equipa de importação trata de tudo para si.</p>
        </div>
        <div className="bg-gray-900 p-8 rounded-3xl text-white shadow-xl">
           <div className="w-12 h-12 bg-blue-500 text-white rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-blue-900/40">
              <Box size={24} />
           </div>
           <h4 className="text-xl font-black mb-2">Entrega Expressa</h4>
           <p className="text-gray-400 text-sm leading-relaxed">Logística avançada para entregar os seus componentes em tempo recorde em Luanda.</p>
        </div>
      </div>
    </div>
  );
};

export default HomePage;


import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
// Fix: Added missing Package icon to the imports from lucide-react
import { Search, SlidersHorizontal, ChevronRight, ShoppingCart, Package } from 'lucide-react';
import { MOCK_PRODUCTS, CATEGORIES } from '../constants';
import { Product, Category } from '../types';

interface HomePageProps {
  addToCart: (product: Product) => void;
}

const HomePage: React.FC<HomePageProps> = ({ addToCart }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Todas');

  const filteredProducts = useMemo(() => {
    return MOCK_PRODUCTS.filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            p.brand.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'Todas' || p.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchTerm, selectedCategory]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Hero Section */}
      <div className="relative rounded-2xl overflow-hidden mb-12 bg-gray-900 h-64 md:h-96">
        <img 
          src="https://picsum.photos/seed/carhero/1200/400" 
          alt="Car engine" 
          className="absolute inset-0 w-full h-full object-cover opacity-50"
        />
        <div className="relative z-10 h-full flex flex-col justify-center px-8 md:px-16 text-white max-w-2xl">
          <h1 className="text-4xl md:text-6xl font-extrabold mb-4 leading-tight">
            Peças Originais, <br /><span className="text-blue-500">Desempenho Real.</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-300 mb-8">
            Encontre tudo o que o seu carro precisa com entrega rápida e pagamento seguro em Angola.
          </p>
          <div>
            <a href="#loja" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg inline-flex items-center space-x-2 transition">
              <span>Ver Catálogo</span>
              <ChevronRight size={20} />
            </a>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div id="loja" className="bg-white p-4 rounded-xl shadow-sm mb-8 border border-gray-100 flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-grow w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input 
            type="text"
            placeholder="Pesquisar por peça, marca ou modelo..."
            className="w-full pl-10 pr-4 py-3 bg-gray-50 border-none rounded-lg focus:ring-2 focus:ring-blue-500 transition outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center space-x-4 w-full md:w-auto">
          <SlidersHorizontal className="text-gray-400 hidden sm:block" size={20} />
          <select 
            className="flex-grow md:w-48 bg-gray-50 border-none rounded-lg py-3 px-4 focus:ring-2 focus:ring-blue-500 transition outline-none"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="Todas">Todas Categorias</option>
            {CATEGORIES.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {filteredProducts.length > 0 ? (
          filteredProducts.map(product => (
            <div key={product.id} className="group bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition">
              <Link to={`/product/${product.id}`} className="block overflow-hidden h-48">
                <img 
                  src={product.imageUrl} 
                  alt={product.name} 
                  className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                />
              </Link>
              <div className="p-4">
                <div className="flex justify-between items-start mb-1">
                  <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded uppercase tracking-wider">
                    {product.brand}
                  </span>
                  <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${product.stock > 0 ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                    {product.stock > 0 ? 'Em Stock' : 'Esgotado'}
                  </span>
                </div>
                <Link to={`/product/${product.id}`} className="block text-lg font-bold text-gray-900 mb-2 hover:text-blue-600 transition truncate">
                  {product.name}
                </Link>
                <p className="text-gray-500 text-sm mb-4 line-clamp-2 h-10">
                  {product.description}
                </p>
                <div className="flex justify-between items-center">
                  <div>
                    <span className="text-2xl font-black text-gray-900">
                      {product.price.toLocaleString('pt-AO', { style: 'currency', currency: 'AOA' })}
                    </span>
                  </div>
                  <button 
                    onClick={() => addToCart(product)}
                    disabled={product.stock === 0}
                    className="p-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white rounded-lg transition"
                  >
                    <ShoppingCart size={20} />
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full py-20 text-center">
            {/* Fix: Added missing Package icon to show when no products are found */}
            <Package size={64} className="mx-auto text-gray-300 mb-4" />
            <h3 className="text-xl font-bold text-gray-700">Nenhum produto encontrado</h3>
            <p className="text-gray-500">Tente ajustar seus filtros de pesquisa.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;

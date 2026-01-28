
import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Search, ShoppingCart, Package } from 'lucide-react';
import { CATEGORIES } from '../constants';
import { Product, User } from '../types';

interface CatalogPageProps {
  products: Product[];
  addToCart: (product: Product) => void;
  user: User | null;
}

const CatalogPage: React.FC<CatalogPageProps> = ({ products, addToCart, user }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Todas');
  const [sortOrder, setSortOrder] = useState<'low' | 'high' | 'newest'>('newest');

  const isAdmin = user?.role === 'admin';

  const filteredProducts = useMemo(() => {
    let result = products.filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            p.brand.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'Todas' || p.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });

    if (sortOrder === 'low') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortOrder === 'high') {
      result.sort((a, b) => b.price - a.price);
    }
    
    return result;
  }, [searchTerm, selectedCategory, sortOrder, products]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-4">
        <div>
          <h1 className="text-3xl font-black text-gray-900 uppercase">Catálogo de Peças</h1>
          <p className="text-gray-500">Explore o nosso stock de componentes de alta qualidade.</p>
        </div>
        <div className="bg-gray-100 px-4 py-2 rounded-xl text-sm font-bold text-gray-600 flex items-center space-x-2">
          <Package size={16} />
          <span>{filteredProducts.length} Produtos Disponíveis</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
        <aside className="space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <label className="block text-xs font-black text-gray-400 uppercase mb-3">Pesquisar</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                type="text" 
                placeholder="Ex: Discos de travão..." 
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition font-medium"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <label className="block text-xs font-black text-gray-400 uppercase mb-3">Categorias</label>
            <div className="space-y-1">
              <button 
                onClick={() => setSelectedCategory('Todas')}
                className={`w-full text-left px-4 py-2 rounded-lg text-sm font-bold transition ${selectedCategory === 'Todas' ? 'bg-blue-600 text-white' : 'text-gray-500 hover:bg-gray-50'}`}
              >
                Todas
              </button>
              {CATEGORIES.map(cat => (
                <button 
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`w-full text-left px-4 py-2 rounded-lg text-sm font-bold transition ${selectedCategory === cat ? 'bg-blue-600 text-white' : 'text-gray-500 hover:bg-gray-50'}`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </aside>

        <div className="lg:col-span-3">
          <div className="flex justify-end mb-6">
            <div className="flex items-center space-x-2 bg-white px-3 py-1.5 rounded-lg border border-gray-100 shadow-sm">
              <span className="text-xs font-bold text-gray-400 uppercase">Ordenar:</span>
              <select 
                className="text-xs font-black text-blue-600 outline-none bg-transparent"
                value={sortOrder}
                onChange={e => setSortOrder(e.target.value as any)}
              >
                <option value="newest">Mais Recentes</option>
                <option value="low">Preço mais baixo</option>
                <option value="high">Preço mais alto</option>
              </select>
            </div>
          </div>

          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredProducts.map(product => (
                <div key={product.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col group">
                  <Link to={`/product/${product.id}`} className="block h-48 overflow-hidden">
                    <img 
                      src={product.imageUrl} 
                      alt={product.name} 
                      className="w-full h-full object-cover group-hover:scale-110 transition duration-500" 
                    />
                  </Link>
                  <div className="p-5 flex-grow flex flex-col">
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">{product.brand}</span>
                      <span className="text-[10px] font-bold text-gray-400 uppercase">{product.category}</span>
                    </div>
                    <Link to={`/product/${product.id}`} className="text-lg font-bold text-gray-900 mb-4 hover:text-blue-600 transition leading-tight line-clamp-2">
                      {product.name}
                    </Link>
                    <div className="mt-auto flex justify-between items-center">
                      <span className="text-xl font-black text-gray-900">{product.price.toLocaleString()} Kz</span>
                      
                      {/* Oculta botão de compra para Admin */}
                      {!isAdmin && (
                        <button 
                          onClick={() => addToCart(product)}
                          disabled={product.stock === 0}
                          className="p-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-200 text-white rounded-xl transition shadow-md shadow-blue-100 active:scale-95"
                        >
                          <ShoppingCart size={18} />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-3xl border-2 border-dashed border-gray-100 p-20 text-center">
              <Search size={40} className="mx-auto text-gray-200 mb-4" />
              <h3 className="text-xl font-bold text-gray-900">Nenhum resultado</h3>
              <p className="text-gray-500 text-sm mt-2">Tente ajustar a sua pesquisa ou os filtros.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CatalogPage;

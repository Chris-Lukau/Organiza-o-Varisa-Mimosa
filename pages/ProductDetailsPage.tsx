
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, ShoppingCart, Truck, ShieldCheck, Zap } from 'lucide-react';
import { MOCK_PRODUCTS } from '../constants';
import { Product } from '../types';
import { generateProductDescription } from '../services/geminiService';

interface ProductDetailsPageProps {
  addToCart: (product: Product) => void;
}

const ProductDetailsPage: React.FC<ProductDetailsPageProps> = ({ addToCart }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [aiDesc, setAiDesc] = useState<string>('');

  useEffect(() => {
    const found = MOCK_PRODUCTS.find(p => p.id === id);
    if (found) {
      setProduct(found);
      // Fetch AI description
      generateProductDescription(found.name, found.category, found.brand).then(setAiDesc);
    }
    setLoading(false);
  }, [id]);

  if (loading) return <div className="p-20 text-center">Carregando...</div>;
  if (!product) return <div className="p-20 text-center">Produto não encontrado.</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <button 
        onClick={() => navigate(-1)} 
        className="flex items-center text-gray-500 hover:text-blue-600 mb-8 transition"
      >
        <ChevronLeft size={20} />
        <span>Voltar</span>
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
        {/* Gallery */}
        <div className="space-y-4">
          <div className="aspect-square bg-gray-50 rounded-xl overflow-hidden">
            <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
          </div>
          <div className="grid grid-cols-4 gap-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="aspect-square bg-gray-50 rounded-lg overflow-hidden cursor-pointer hover:ring-2 hover:ring-blue-500 transition">
                <img src={`https://picsum.photos/seed/${product.id + i}/200/200`} alt="thumb" />
              </div>
            ))}
          </div>
        </div>

        {/* Info */}
        <div className="flex flex-col">
          <div className="mb-6">
            <span className="text-sm font-bold text-blue-600 uppercase tracking-widest">{product.brand}</span>
            <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mt-2">{product.name}</h1>
            <div className="flex items-center space-x-4 mt-4 text-sm text-gray-500">
              <span className="bg-gray-100 px-3 py-1 rounded-full">{product.category}</span>
              <span>SKU: #AP{product.id}009</span>
            </div>
          </div>

          <div className="text-3xl font-black text-gray-900 mb-8">
            {product.price.toLocaleString('pt-AO', { style: 'currency', currency: 'AOA' })}
          </div>

          <div className="space-y-6 mb-8">
            <div>
              <h3 className="font-bold text-gray-900 mb-2">Sobre este item</h3>
              <p className="text-gray-600 leading-relaxed">{product.description}</p>
            </div>

            {aiDesc && (
              <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                <div className="flex items-center space-x-2 text-blue-700 font-bold text-sm mb-1 uppercase tracking-wider">
                  <Zap size={16} />
                  <span>Destaque Técnico AI</span>
                </div>
                <p className="text-blue-800 text-sm italic">"{aiDesc}"</p>
              </div>
            )}
          </div>

          <div className="grid grid-cols-3 gap-4 mb-10">
            <div className="flex flex-col items-center p-3 bg-gray-50 rounded-lg text-center">
              <Truck size={20} className="text-blue-600 mb-1" />
              <span className="text-[10px] font-bold text-gray-600 uppercase">Entrega em 24h</span>
            </div>
            <div className="flex flex-col items-center p-3 bg-gray-50 rounded-lg text-center">
              <ShieldCheck size={20} className="text-blue-600 mb-1" />
              <span className="text-[10px] font-bold text-gray-600 uppercase">Original</span>
            </div>
            <div className="flex flex-col items-center p-3 bg-gray-50 rounded-lg text-center">
              <Zap size={20} className="text-blue-600 mb-1" />
              <span className="text-[10px] font-bold text-gray-600 uppercase">Instalação disp.</span>
            </div>
          </div>

          <div className="mt-auto space-y-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500">Disponibilidade:</span>
              <span className={`font-bold ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {product.stock > 0 ? `${product.stock} em stock` : 'Esgotado'}
              </span>
            </div>
            <button 
              onClick={() => addToCart(product)}
              disabled={product.stock === 0}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white font-bold py-4 rounded-xl flex items-center justify-center space-x-3 transition transform active:scale-95"
            >
              <ShoppingCart size={22} />
              <span>Adicionar ao Carrinho</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsPage;

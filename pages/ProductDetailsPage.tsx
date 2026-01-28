
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ChevronLeft, ShoppingCart, Truck, ShieldCheck, Zap, Settings } from 'lucide-react';
import { Product, User } from '../types';
import { generateProductDescription } from '../services/geminiService';

interface ProductDetailsPageProps {
  products: Product[];
  addToCart: (product: Product) => void;
  user: User | null;
}

const ProductDetailsPage: React.FC<ProductDetailsPageProps> = ({ products, addToCart, user }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [aiDesc, setAiDesc] = useState<string>('');
  const [activeImage, setActiveImage] = useState<string>('');

  const isAdmin = user?.role === 'admin';

  useEffect(() => {
    const found = products.find(p => p.id === id);
    if (found) {
      setProduct(found);
      setActiveImage(found.imageUrl); // Define a imagem principal inicial
      generateProductDescription(found.name, found.category, found.brand).then(setAiDesc);
    }
    setLoading(false);
  }, [id, products]);

  if (loading) return <div className="p-20 text-center font-bold text-blue-600 animate-pulse text-xs uppercase tracking-widest">Carregando detalhes técnicos...</div>;
  if (!product) return <div className="p-20 text-center font-bold text-red-500 uppercase text-xs tracking-widest">Peça não encontrada no catálogo.</div>;

  // Garante que temos um array de imagens para iterar
  const productImages = product.images && product.images.length > 0 ? product.images : [product.imageUrl];

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <button 
        onClick={() => navigate(-1)} 
        className="flex items-center text-gray-500 hover:text-blue-600 mb-8 transition font-bold group"
      >
        <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
        <span className="uppercase text-xs tracking-widest">Voltar ao Catálogo</span>
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 bg-white p-8 md:p-12 rounded-3xl shadow-sm border border-gray-100">
        <div className="space-y-6">
          {/* Visualizador de Imagem Principal */}
          <div className="aspect-square bg-gray-50 rounded-2xl overflow-hidden shadow-inner border border-gray-100 relative group/main">
            <img 
              src={activeImage} 
              alt={product.name} 
              className="w-full h-full object-cover transition-all duration-500 ease-in-out transform group-hover/main:scale-110" 
            />
          </div>

          {/* Miniaturas Interativas */}
          <div className="grid grid-cols-4 gap-4">
            {productImages.map((img, i) => (
              <button 
                key={i} 
                onClick={() => setActiveImage(img)}
                className={`aspect-square bg-gray-50 rounded-xl overflow-hidden transition-all duration-300 border-2 ${
                  activeImage === img 
                    ? 'border-blue-600 ring-4 ring-blue-50 shadow-lg scale-95' 
                    : 'border-transparent hover:border-gray-200 opacity-70 hover:opacity-100'
                }`}
              >
                <img src={img} alt={`Miniatura ${i + 1}`} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col">
          <div className="mb-6">
            <span className="text-xs font-black text-blue-600 bg-blue-50 px-3 py-1 rounded uppercase tracking-widest">{product.brand}</span>
            <h1 className="text-3xl md:text-5xl font-black text-gray-900 mt-4 leading-tight">{product.name}</h1>
            <div className="flex items-center space-x-4 mt-4 text-sm font-bold text-gray-400">
              <span className="bg-gray-100 px-3 py-1 rounded-full uppercase tracking-tighter text-[10px]">{product.category}</span>
              <span className="text-[10px]">SKU: #AP{product.id.slice(0, 5).toUpperCase()}</span>
            </div>
          </div>

          <div className="text-4xl font-black text-gray-900 mb-8 flex items-end space-x-2">
            <span>{product.price.toLocaleString()} Kz</span>
            <span className="text-[10px] text-gray-400 font-black mb-2 uppercase tracking-widest">(IVA Incluído)</span>
          </div>

          <div className="space-y-6 mb-10">
            <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
              <h3 className="font-black text-gray-900 mb-2 uppercase text-[10px] tracking-widest">Especificações</h3>
              <p className="text-gray-600 leading-relaxed font-medium whitespace-pre-line">{product.description}</p>
            </div>

            {aiDesc && (
              <div className="bg-blue-600 p-6 rounded-2xl shadow-xl shadow-blue-900/20">
                <div className="flex items-center space-x-2 text-blue-100 font-black text-[10px] mb-2 uppercase tracking-widest">
                  <Zap size={14} />
                  <span>Destaque de Engenharia</span>
                </div>
                <p className="text-white text-sm italic font-medium leading-relaxed">"{aiDesc}"</p>
              </div>
            )}
          </div>

          <div className="grid grid-cols-3 gap-4 mb-10">
            <div className="flex flex-col items-center p-4 bg-gray-50 rounded-2xl text-center border border-gray-100">
              <Truck size={20} className="text-blue-600 mb-2" />
              <span className="text-[8px] font-black text-gray-500 uppercase leading-none">Entrega Expressa</span>
            </div>
            <div className="flex flex-col items-center p-4 bg-gray-50 rounded-2xl text-center border border-gray-100">
              <ShieldCheck size={20} className="text-blue-600 mb-2" />
              <span className="text-[8px] font-black text-gray-500 uppercase leading-none">Garantia Pro</span>
            </div>
            <div className="flex flex-col items-center p-4 bg-gray-50 rounded-2xl text-center border border-gray-100">
              <Zap size={20} className="text-blue-600 mb-2" />
              <span className="text-[8px] font-black text-gray-500 uppercase leading-none">Original</span>
            </div>
          </div>

          <div className="mt-auto space-y-4">
            <div className="flex items-center justify-between px-2">
              <span className="text-gray-500 font-bold text-xs uppercase tracking-widest">Stock:</span>
              <span className={`font-black uppercase text-xs ${product.stock > 0 ? (product.stock < 5 ? 'text-orange-500' : 'text-green-600') : 'text-red-600'}`}>
                {product.stock > 0 ? `${product.stock} Unidades` : 'Esgotado'}
              </span>
            </div>
            
            {!isAdmin ? (
              <button 
                onClick={() => addToCart(product)}
                disabled={product.stock === 0}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-200 text-white font-black py-5 rounded-2xl flex items-center justify-center space-x-3 transition transform active:scale-95 shadow-xl shadow-blue-900/20"
              >
                <ShoppingCart size={22} />
                <span className="uppercase tracking-widest text-sm">Adicionar ao Carrinho</span>
              </button>
            ) : (
              <Link 
                to="/admin/inventory"
                className="w-full bg-gray-900 text-white font-black py-5 rounded-2xl flex items-center justify-center space-x-3 transition shadow-xl"
              >
                <Settings size={22} />
                <span className="uppercase tracking-widest text-sm">Gerir no Inventário</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsPage;

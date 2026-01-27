
import React, { useState, useRef } from 'react';
import { Plus, Search, Edit2, Trash2, Package, MoreVertical, RefreshCw, X, Upload, Image as ImageIcon } from 'lucide-react';
import { MOCK_PRODUCTS, CATEGORIES } from '../../constants';
import { Product, Category } from '../../types';

interface ProductFormModalProps {
  onClose: () => void;
  onSave: (product: Partial<Product> & { images: string[] }) => void;
  initialData?: Product;
}

const ProductFormModal: React.FC<ProductFormModalProps> = ({ onClose, onSave, initialData }) => {
  const [images, setImages] = useState<string[]>(initialData ? [initialData.imageUrl] : []);
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    category: initialData?.category || Category.MOTOR,
    brand: initialData?.brand || '',
    price: initialData?.price || 0,
    stock: initialData?.stock || 0,
    description: initialData?.description || ''
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fix: Explicitly type the file parameter to avoid 'unknown' inference and cast to Blob for FileReader compatibility
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      Array.from(files).forEach((file: File) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setImages(prev => [...prev, reader.result as string]);
        };
        // Fix: Explicitly treating file as Blob to satisfy type checker and fix line 33 error
        reader.readAsDataURL(file as Blob);
      });
    }
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ ...formData, images });
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="bg-gray-900 px-8 py-6 flex justify-between items-center">
          <h2 className="text-xl font-black text-white">{initialData ? 'Editar Produto' : 'Novo Produto'}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition p-2 hover:bg-white/10 rounded-full">
            <X size={24} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-8 max-h-[80vh] overflow-y-auto custom-scrollbar">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Basic Info */}
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Nome da Peça</label>
                <input 
                  required
                  type="text" 
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Categoria</label>
                <select 
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.category}
                  onChange={e => setFormData({...formData, category: e.target.value as Category})}
                >
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Preço (Kz)</label>
                  <input 
                    required
                    type="number" 
                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                    value={formData.price}
                    onChange={e => setFormData({...formData, price: Number(e.target.value)})}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Stock</label>
                  <input 
                    required
                    type="number" 
                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                    value={formData.stock}
                    onChange={e => setFormData({...formData, stock: Number(e.target.value)})}
                  />
                </div>
              </div>
            </div>

            {/* Images and Description */}
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Imagens do Produto</label>
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-gray-200 rounded-2xl p-6 flex flex-col items-center justify-center bg-gray-50 hover:bg-gray-100 hover:border-blue-300 transition cursor-pointer group"
                >
                  <Upload className="text-gray-400 group-hover:text-blue-500 mb-2 transition" size={32} />
                  <span className="text-xs font-bold text-gray-500">Clique para carregar imagens</span>
                  <input 
                    type="file" 
                    multiple 
                    hidden 
                    ref={fileInputRef} 
                    onChange={handleFileChange}
                    accept="image/*"
                  />
                </div>
                
                {/* Image Gallery Thumbnails */}
                {images.length > 0 && (
                  <div className="mt-4 grid grid-cols-4 gap-2">
                    {images.map((img, idx) => (
                      <div key={idx} className="relative aspect-square rounded-lg overflow-hidden group border border-gray-100 shadow-sm">
                        <img src={img} alt={`Preview ${idx}`} className="w-full h-full object-cover" />
                        <button 
                          type="button"
                          onClick={() => removeImage(idx)}
                          className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition shadow-lg"
                        >
                          <X size={12} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Descrição</label>
                <textarea 
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 h-28 resize-none"
                  value={formData.description}
                  onChange={e => setFormData({...formData, description: e.target.value})}
                ></textarea>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-100 flex justify-end space-x-3">
            <button 
              type="button"
              onClick={onClose}
              className="px-6 py-3 font-bold text-gray-500 hover:text-gray-700 transition"
            >
              Cancelar
            </button>
            <button 
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-blue-100 transition transform active:scale-95"
            >
              Salvar Alterações
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const AdminInventory: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | undefined>(undefined);

  const products = MOCK_PRODUCTS.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.brand.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSave = (data: any) => {
    console.log("Saving product data:", data);
    // Em um cenário real, aqui faríamos um POST/PUT para a API
    setIsAdding(false);
    setEditingProduct(undefined);
    alert("Produto salvo com sucesso!");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-black text-gray-900">Gestão de Inventário</h1>
          <p className="text-gray-500">Controle de stock, preços e catálogo de produtos.</p>
        </div>
        <button 
          onClick={() => setIsAdding(true)}
          className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold flex items-center space-x-2 shadow-lg shadow-blue-100 hover:bg-blue-700 transition"
        >
          <Plus size={20} />
          <span>Novo Produto</span>
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-8 flex flex-col md:flex-row gap-4">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input 
            type="text"
            placeholder="Pesquisar por SKU, Nome ou Categoria..."
            className="w-full pl-10 pr-4 py-3 bg-gray-50 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <select className="bg-gray-50 border-none rounded-xl px-4 py-3 outline-none font-bold text-gray-700">
            <option>Todas Categorias</option>
            {Object.values(Category).map(c => <option key={c}>{c}</option>)}
          </select>
          <button className="p-3 bg-gray-50 text-gray-500 rounded-xl hover:bg-gray-100 transition">
            <RefreshCw size={20} />
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 text-gray-500 text-xs font-bold uppercase tracking-wider">
            <tr>
              <th className="px-6 py-4">Produto</th>
              <th className="px-6 py-4">Categoria</th>
              <th className="px-6 py-4">Stock</th>
              <th className="px-6 py-4">Preço Venda</th>
              <th className="px-6 py-4 text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {products.map(p => (
              <tr key={p.id} className="hover:bg-gray-50 transition group">
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 rounded-xl overflow-hidden bg-gray-100 border border-gray-200">
                      <img src={p.imageUrl} alt={p.name} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <div className="font-bold text-gray-900 group-hover:text-blue-600 transition">{p.name}</div>
                      <div className="text-xs text-gray-400">Marca: {p.brand}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="bg-blue-50 text-blue-600 px-2 py-1 rounded-md text-[10px] font-bold uppercase">{p.category}</span>
                </td>
                <td className="px-6 py-4">
                  <div className={`text-sm font-bold ${p.stock < 5 ? 'text-red-500' : 'text-gray-900'}`}>
                    {p.stock} unidades
                  </div>
                  {p.stock < 5 && <div className="text-[10px] font-bold text-red-400 uppercase">Stock Baixo</div>}
                </td>
                <td className="px-6 py-4 font-black text-gray-900">{p.price.toLocaleString()} Kz</td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end space-x-2">
                    <button 
                      onClick={() => setEditingProduct(p)}
                      className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
                    >
                      <Edit2 size={18} />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"><Trash2 size={18} /></button>
                    <button className="p-2 text-gray-400 hover:bg-gray-100 rounded-lg transition"><MoreVertical size={18} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {products.length === 0 && (
          <div className="py-20 text-center text-gray-400">
            <Package size={48} className="mx-auto mb-4 opacity-20" />
            <p className="font-bold">Nenhum produto encontrado.</p>
          </div>
        )}
      </div>

      {(isAdding || editingProduct) && (
        <ProductFormModal 
          onClose={() => { setIsAdding(false); setEditingProduct(undefined); }}
          onSave={handleSave}
          initialData={editingProduct}
        />
      )}
    </div>
  );
};

export default AdminInventory;

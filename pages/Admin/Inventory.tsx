
import React, { useState, useRef } from 'react';
import { Plus, Search, Edit2, Trash2, Package, RefreshCw, X, Upload, Save, AlertCircle, Star, GripVertical, Download, Inbox, AlertTriangle } from 'lucide-react';
import { CATEGORIES } from '../../constants';
import { Product, Category } from '../../types';

interface ProductFormModalProps {
  onClose: () => void;
  onSave: (product: Product) => void;
  initialData?: Product;
}

const ProductFormModal: React.FC<ProductFormModalProps> = ({ onClose, onSave, initialData }) => {
  const [images, setImages] = useState<string[]>(initialData?.images || (initialData ? [initialData.imageUrl] : []));
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    category: initialData?.category || Category.MOTOR,
    brand: initialData?.brand || '',
    price: initialData?.price || 0,
    stock: initialData?.stock || 0,
    minStockThreshold: initialData?.minStockThreshold || 5,
    description: initialData?.description || ''
  });
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dragItem = useRef<number | null>(null);
  const dragOverItem = useRef<number | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      Array.from(files).forEach((file: File) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setImages(prev => [...prev, reader.result as string]);
        };
        reader.readAsDataURL(file as Blob);
      });
    }
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const setAsPrimary = (index: number) => {
    const newImages = [...images];
    const [selected] = newImages.splice(index, 1);
    newImages.unshift(selected);
    setImages(newImages);
  };

  const onDragStart = (e: React.DragEvent, index: number) => {
    dragItem.current = index;
  };

  const onDragEnter = (e: React.DragEvent, index: number) => {
    dragOverItem.current = index;
  };

  const onDragEnd = () => {
    if (dragItem.current !== null && dragOverItem.current !== null) {
      const copyListItems = [...images];
      const dragItemContent = copyListItems[dragItem.current];
      copyListItems.splice(dragItem.current, 1);
      copyListItems.splice(dragOverItem.current, 0, dragItemContent);
      dragItem.current = null;
      dragOverItem.current = null;
      setImages(copyListItems);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (images.length === 0) {
      alert("Adicione uma foto.");
      return;
    }
    onSave({
      id: initialData?.id || Math.random().toString(36).substr(2, 9),
      ...formData,
      imageUrl: images[0],
      images: images
    });
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-3xl rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in slide-in-from-bottom-4 duration-300">
        <div className="bg-gray-900 px-8 py-6 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-black text-white uppercase tracking-tight">{initialData ? 'Editar Peça' : 'Nova Peça'}</h2>
            <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest mt-1">Gestão de Inventário</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition p-2 hover:bg-white/10 rounded-full">
            <X size={24} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-8 max-h-[85vh] overflow-y-auto custom-scrollbar">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="space-y-4">
                <input 
                  required
                  type="text" 
                  placeholder="Nome da Peça"
                  className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 font-bold"
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                />
                <input 
                  required
                  type="text" 
                  placeholder="Marca"
                  className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 font-bold"
                  value={formData.brand}
                  onChange={e => setFormData({...formData, brand: e.target.value})}
                />
                <select 
                  className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 font-bold"
                  value={formData.category}
                  onChange={e => setFormData({...formData, category: e.target.value as Category})}
                >
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              <div className="grid grid-cols-1 gap-4">
                <div className="bg-gray-50 p-4 rounded-2xl border border-gray-200">
                  <span className="text-[10px] font-bold text-gray-400 block uppercase mb-1">Preço (Kz)</span>
                  <input 
                    required
                    type="number" 
                    className="w-full bg-transparent outline-none font-black text-lg"
                    value={formData.price}
                    onChange={e => setFormData({...formData, price: Number(e.target.value)})}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-4 rounded-2xl border border-gray-200">
                    <span className="text-[10px] font-bold text-gray-400 block uppercase mb-1">Stock Atual</span>
                    <input 
                      required
                      type="number" 
                      className="w-full bg-transparent outline-none font-black text-lg text-blue-600"
                      value={formData.stock}
                      onChange={e => setFormData({...formData, stock: Number(e.target.value)})}
                    />
                  </div>
                  <div className="bg-gray-50 p-4 rounded-2xl border border-gray-200">
                    <span className="text-[10px] font-bold text-gray-400 block uppercase mb-1">Aviso Reposição</span>
                    <input 
                      required
                      type="number" 
                      className="w-full bg-transparent outline-none font-black text-lg text-orange-600"
                      value={formData.minStockThreshold}
                      onChange={e => setFormData({...formData, minStockThreshold: Number(e.target.value)})}
                    />
                  </div>
                </div>
              </div>

              <textarea 
                required
                placeholder="Descrição técnica..."
                className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 h-32 resize-none"
                value={formData.description}
                onChange={e => setFormData({...formData, description: e.target.value})}
              ></textarea>
            </div>

            <div className="space-y-4">
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-gray-200 rounded-3xl p-10 flex flex-col items-center justify-center bg-gray-50 hover:bg-gray-100 cursor-pointer group shadow-inner"
              >
                <Upload className="text-gray-300 group-hover:text-blue-500 mb-2" size={40} />
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Fotos da Peça</span>
                <input type="file" multiple hidden ref={fileInputRef} onChange={handleFileChange} accept="image/*" />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                {images.map((img, idx) => (
                  <div 
                    key={idx} 
                    draggable
                    onDragStart={(e) => onDragStart(e, idx)}
                    onDragEnter={(e) => onDragEnter(e, idx)}
                    onDragEnd={onDragEnd}
                    onDragOver={(e) => e.preventDefault()}
                    className={`relative aspect-square rounded-2xl overflow-hidden group border-4 ${idx === 0 ? 'border-yellow-400' : 'border-white'} shadow-md`}
                  >
                    <img src={img} alt="preview" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center space-x-2">
                      <button type="button" onClick={() => setAsPrimary(idx)} className="p-2 bg-yellow-400 text-white rounded-lg shadow-lg">
                        <Star size={16} fill="white" />
                      </button>
                      <button type="button" onClick={() => removeImage(idx)} className="p-2 bg-red-50 text-white rounded-lg shadow-lg">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-10 flex justify-end items-center space-x-4">
            <button type="button" onClick={onClose} className="px-6 py-4 font-black text-gray-400 hover:text-red-500 uppercase tracking-widest text-xs">Cancelar</button>
            <button type="submit" className="bg-blue-600 text-white px-10 py-4 rounded-2xl font-black shadow-xl shadow-blue-200 uppercase tracking-widest text-xs">Salvar</button>
          </div>
        </form>
      </div>
    </div>
  );
};

interface AdminInventoryProps {
  products: Product[];
  onAdd: (p: Product) => void;
  onUpdate: (p: Product) => void;
  onDelete: (id: string) => void;
}

const AdminInventory: React.FC<AdminInventoryProps> = ({ products, onAdd, onUpdate, onDelete }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | undefined>(undefined);

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.brand.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSave = (data: Product) => {
    if (editingProduct) onUpdate(data);
    else onAdd(data);
    setIsAdding(false);
    setEditingProduct(undefined);
  };

  const handleExportPDF = () => {
    window.print();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12 print:hidden">
        <div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tight uppercase">Inventário</h1>
          <p className="text-gray-500 font-medium mt-1">Gestão de stock e catálogo técnico.</p>
        </div>
        <div className="flex items-center space-x-3 w-full md:w-auto">
          <button 
            onClick={handleExportPDF}
            className="flex-1 md:flex-none bg-white border border-gray-200 text-gray-700 px-6 py-4 rounded-2xl font-bold flex items-center justify-center space-x-2"
          >
            <Download size={20} />
            <span>PDF</span>
          </button>
          <button 
            onClick={() => setIsAdding(true)}
            className="flex-1 md:flex-none bg-blue-600 text-white px-8 py-4 rounded-2xl font-black flex items-center justify-center space-x-3 shadow-xl shadow-blue-100"
          >
            <Plus size={24} />
            <span className="uppercase tracking-widest text-sm">Nova Peça</span>
          </button>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 mb-10 flex flex-col md:flex-row gap-6 items-center print:hidden">
        <div className="relative flex-grow w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input 
            type="text"
            placeholder="Pesquisar catálogo..."
            className="w-full pl-12 pr-4 py-4 bg-gray-50 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 font-bold shadow-inner border border-gray-100"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center space-x-2 bg-blue-50 px-6 py-4 rounded-2xl border border-blue-100">
          <RefreshCw size={18} className="text-blue-600" />
          <span className="text-[10px] font-black text-blue-700 uppercase tracking-widest">{filteredProducts.length} Peças Ativas</span>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-900 text-gray-400 text-[10px] font-black uppercase tracking-widest">
              <tr>
                <th className="px-8 py-5">Produto</th>
                <th className="px-6 py-5">Categoria</th>
                <th className="px-6 py-5">Stock Atual</th>
                <th className="px-6 py-5">Preço</th>
                <th className="px-8 py-5 text-right print:hidden">Acções</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredProducts.map(p => {
                const isLowStock = p.stock <= (p.minStockThreshold ?? 5);
                return (
                  <tr key={p.id} className={`hover:bg-gray-50/50 transition-colors group ${isLowStock ? 'bg-orange-50/30' : ''}`}>
                    <td className="px-8 py-6">
                      <div className="flex items-center space-x-4">
                        <div className="w-14 h-14 rounded-xl overflow-hidden bg-gray-100 border border-gray-200">
                          <img src={p.imageUrl} alt={p.name} className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <div className="font-black text-gray-900 text-sm flex items-center space-x-2">
                            <span>{p.name}</span>
                            {isLowStock && <AlertTriangle size={14} className="text-orange-500" />}
                          </div>
                          <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{p.brand}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-6">
                      <span className="bg-gray-100 text-gray-500 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">{p.category}</span>
                    </td>
                    <td className="px-6 py-6">
                      <div className="flex flex-col">
                        <span className={`text-sm font-black ${isLowStock ? 'text-orange-600' : 'text-gray-900'}`}>{p.stock} UN</span>
                        {isLowStock && <span className="text-[8px] font-black text-orange-400 uppercase tracking-tighter">Abaixo do limite ({p.minStockThreshold ?? 5})</span>}
                      </div>
                    </td>
                    <td className="px-6 py-6 font-black text-gray-900">{p.price.toLocaleString()} Kz</td>
                    <td className="px-8 py-6 text-right print:hidden">
                      <div className="flex justify-end space-x-2">
                        <button onClick={() => setEditingProduct(p)} className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-600 hover:text-white transition"><Edit2 size={16} /></button>
                        <button onClick={() => { if(window.confirm(`Apagar ${p.name}?`)) onDelete(p.id) }} className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-600 hover:text-white transition"><Trash2 size={16} /></button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {filteredProducts.length === 0 && (
          <div className="py-24 text-center">
            <Inbox className="mx-auto text-gray-200 mb-4" size={48} />
            <p className="text-gray-400 font-bold uppercase text-xs tracking-widest">Nenhum produto em stock</p>
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

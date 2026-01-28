
import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Link, useLocation, NavLink } from 'react-router-dom';
import { ShoppingCart, User as UserIcon, LogOut, Package, Menu, X, Settings, CheckCircle2, Box, FileText, ChevronRight, LayoutDashboard } from 'lucide-react';
import { CartItem, User, Product, Order } from './types';
import { MOCK_PRODUCTS } from './constants';

// Pages
import HomePage from './pages/HomePage';
import CatalogPage from './pages/CatalogPage';
import ProductDetailsPage from './pages/ProductDetailsPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import AuthPage from './pages/AuthPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import ProfilePage from './pages/ProfilePage';
import AdminDashboard from './pages/Admin/Dashboard';
import AdminInventory from './pages/Admin/Inventory';
import AdminReports from './pages/Admin/Reports';

const Toast: React.FC<{ message: string; onClose: () => void }> = ({ message, onClose }) => (
  <div className="fixed bottom-8 right-8 z-[100] animate-in slide-in-from-right-10 duration-300">
    <div className="bg-gray-900 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center space-x-3 border border-gray-800">
      <div className="bg-blue-500 p-1 rounded-full">
        <CheckCircle2 size={16} />
      </div>
      <span className="font-bold text-sm">{message}</span>
      <button onClick={onClose} className="text-gray-500 hover:text-white transition">
        <X size={16} />
      </button>
    </div>
  </div>
);

const AdminSubNav: React.FC = () => {
  const location = useLocation();
  if (!location.pathname.startsWith('/admin')) return null;

  return (
    <div className="bg-white border-b border-gray-100 print:hidden">
      <div className="max-w-7xl mx-auto px-4 overflow-x-auto">
        <div className="flex space-x-2 py-3">
          <NavLink 
            to="/admin" 
            end
            className={({ isActive }) => 
              `flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                isActive ? 'bg-blue-600 text-white shadow-lg shadow-blue-100' : 'text-gray-400 hover:bg-gray-50 hover:text-gray-900'
              }`
            }
          >
            <LayoutDashboard size={14} />
            <span>Dashboard</span>
          </NavLink>
          <NavLink 
            to="/admin/inventory" 
            className={({ isActive }) => 
              `flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                isActive ? 'bg-blue-600 text-white shadow-lg shadow-blue-100' : 'text-gray-400 hover:bg-gray-50 hover:text-gray-900'
              }`
            }
          >
            <Box size={14} />
            <span>Inventário</span>
          </NavLink>
          <NavLink 
            to="/admin/reports" 
            className={({ isActive }) => 
              `flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                isActive ? 'bg-blue-600 text-white shadow-lg shadow-blue-100' : 'text-gray-400 hover:bg-gray-50 hover:text-gray-900'
              }`
            }
          >
            <FileText size={14} />
            <span>Relatórios</span>
          </NavLink>
        </div>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const isAdmin = user?.role === 'admin';

  useEffect(() => {
    const savedProducts = localStorage.getItem('products');
    if (savedProducts) {
      setProducts(JSON.parse(savedProducts));
    } else {
      setProducts(MOCK_PRODUCTS);
      localStorage.setItem('products', JSON.stringify(MOCK_PRODUCTS));
    }

    const savedOrders = localStorage.getItem('orders');
    if (savedOrders) setOrders(JSON.parse(savedOrders));

    const savedUser = localStorage.getItem('user');
    if (savedUser) setUser(JSON.parse(savedUser));
    
    const savedCart = localStorage.getItem('cart');
    if (savedCart) setCart(JSON.parse(savedCart));
  }, []);

  const showNotification = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const addToCart = (product: Product) => {
    if (isAdmin) {
      showNotification("Administradores não podem realizar compras.");
      return;
    }
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      let updated;
      if (existing) {
        updated = prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      } else {
        updated = [...prev, { ...product, quantity: 1 }];
      }
      localStorage.setItem('cart', JSON.stringify(updated));
      return updated;
    });
    showNotification(`${product.name} adicionado ao cesto!`);
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => {
      const updated = prev.filter(item => item.id !== productId);
      localStorage.setItem('cart', JSON.stringify(updated));
      return updated;
    });
  };

  const updateQuantity = (productId: string, qty: number) => {
    setCart(prev => {
      const updated = prev.map(item => item.id === productId ? { ...item, quantity: Math.max(1, qty) } : item);
      localStorage.setItem('cart', JSON.stringify(updated));
      return updated;
    });
  };

  const clearCart = () => {
    setCart([]);
    localStorage.removeItem('cart');
  };

  const addOrder = (order: Order) => {
    setOrders(prev => {
      const updated = [order, ...prev];
      localStorage.setItem('orders', JSON.stringify(updated));
      return updated;
    });
  };

  const logout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('cart');
    setUser(null);
    setCart([]);
    setIsMenuOpen(false);
    window.location.assign('#/'); 
    window.location.reload();
  };

  const handleUpdateProducts = (updatedProducts: Product[]) => {
    setProducts(updatedProducts);
    localStorage.setItem('products', JSON.stringify(updatedProducts));
  };

  const handleDeleteProduct = (id: string) => {
    setProducts(prev => {
      const updated = prev.filter(p => p.id !== id);
      localStorage.setItem('products', JSON.stringify(updated));
      return updated;
    });
    showNotification("Produto removido com sucesso.");
  };

  return (
    <HashRouter>
      <div className="min-h-screen flex flex-col bg-gray-50 selection:bg-blue-100 selection:text-blue-900 overflow-x-hidden">
        <div className="bg-gray-900 text-[10px] py-2 px-4 text-center text-gray-400 font-bold uppercase tracking-[0.2em] border-b border-gray-800 print:hidden">
          Distribuidor Oficial de Peças Premium em Angola • Entrega em Luanda em 24h
        </div>

        <nav className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-gray-100 print:hidden">
          <div className="max-w-7xl mx-auto px-4 h-20 flex justify-between items-center">
            <Link to="/" className="flex items-center space-x-3 group" onClick={() => setIsMenuOpen(false)}>
              <div className="bg-blue-600 p-2.5 rounded-xl shadow-lg shadow-blue-200 group-hover:rotate-12 transition-transform duration-300">
                <Package className="text-white" size={24} />
              </div>
              <div>
                <span className="text-xl font-black tracking-tighter text-gray-900 uppercase">AutoPeças<span className="text-blue-600">Pro</span></span>
                <span className="block text-[8px] font-black text-gray-400 uppercase tracking-widest leading-none">Angola Distribution</span>
              </div>
            </Link>

            <div className="hidden md:flex items-center space-x-1">
              {[
                { label: 'Início', path: '/' },
                { label: 'Catálogo', path: '/catalog' },
                { label: 'Sobre Nós', path: '/about' },
                { label: 'Contacto', path: '/contact' }
              ].map(link => (
                <Link 
                  key={link.path} 
                  to={link.path} 
                  className="px-5 py-2 rounded-xl text-sm font-bold text-gray-500 hover:text-blue-600 hover:bg-blue-50 transition"
                >
                  {link.label}
                </Link>
              ))}
            </div>

            <div className="flex items-center space-x-2 md:space-x-4">
              {!isAdmin && (
                <Link to="/cart" className="relative p-3 bg-gray-50 hover:bg-blue-50 text-gray-700 hover:text-blue-600 rounded-2xl transition group">
                  <ShoppingCart size={22} />
                  {cart.length > 0 && (
                    <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-[10px] font-black w-5 h-5 flex items-center justify-center rounded-full border-2 border-white animate-pulse">
                      {cart.reduce((acc, item) => acc + item.quantity, 0)}
                    </span>
                  )}
                </Link>
              )}
              
              {user ? (
                <div className="hidden md:flex items-center space-x-2">
                  <Link 
                    to={isAdmin ? '/admin' : '/profile'} 
                    className={`flex items-center space-x-2 px-5 py-2.5 rounded-2xl font-bold text-sm shadow-xl transition active:scale-95 ${
                      isAdmin ? 'bg-blue-600 text-white shadow-blue-100' : 'bg-gray-900 text-white shadow-gray-200'
                    }`}
                  >
                    {isAdmin ? <Settings size={18} /> : <UserIcon size={18} />}
                    <span>{isAdmin ? 'Painel Admin' : 'Meu Perfil'}</span>
                  </Link>
                  <button onClick={logout} className="p-2.5 text-gray-400 hover:text-red-500 transition">
                    <LogOut size={20} />
                  </button>
                </div>
              ) : (
                <Link to="/auth" className="hidden md:flex items-center space-x-2 bg-gray-900 text-white px-6 py-2.5 rounded-2xl font-bold text-sm hover:bg-black transition shadow-lg">
                  <UserIcon size={18} />
                  <span>Entrar</span>
                </Link>
              )}

              <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)} 
                className="md:hidden p-3 bg-gray-100 text-gray-900 rounded-2xl hover:bg-gray-200 transition"
                aria-label="Menu"
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>

          <div 
            className={`fixed inset-0 bg-black/60 backdrop-blur-md z-50 transition-opacity duration-300 md:hidden ${isMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
            onClick={() => setIsMenuOpen(false)}
          />

          <div 
            className={`fixed top-0 right-0 h-full w-[85%] max-w-sm bg-gray-950 opacity-100 text-white z-[60] shadow-2xl transition-transform duration-500 ease-out transform md:hidden ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}
          >
            <div className="p-8 flex flex-col h-full">
              <div className="flex justify-between items-center mb-10">
                <span className="text-xs font-black text-blue-500 uppercase tracking-[0.2em]">AutoPeças Pro Menu</span>
                <button onClick={() => setIsMenuOpen(false)} className="p-2.5 bg-white/10 rounded-xl text-white">
                  <X size={24} />
                </button>
              </div>

              <div className="space-y-1 flex-grow">
                {[
                  { label: 'Início', path: '/' },
                  { label: 'Catálogo', path: '/catalog' },
                  { label: 'Sobre Nós', path: '/about' },
                  { label: 'Contacto', path: '/contact' }
                ].map(link => (
                  <Link 
                    key={link.path} 
                    to={link.path} 
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center justify-between p-5 rounded-2xl text-xl font-black hover:bg-blue-600 transition-all group"
                  >
                    <span className="group-hover:translate-x-2 transition-transform">{link.label}</span>
                    <ChevronRight size={20} className="text-gray-700 group-hover:text-white" />
                  </Link>
                ))}
                
                {user && (
                   <div className="pt-6 mt-6 border-t border-white/10 space-y-2">
                    <span className="px-5 py-2 text-[10px] font-black text-blue-400 uppercase tracking-[0.3em] block">Sua Conta</span>
                    <Link 
                      to={isAdmin ? "/admin" : "/profile"} 
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center justify-between p-5 rounded-2xl text-xl font-black bg-blue-600 text-white transition shadow-2xl shadow-blue-900/40"
                    >
                      <span>{isAdmin ? 'Painel Admin' : 'Ver Perfil'}</span>
                      {isAdmin ? <Settings size={22} /> : <UserIcon size={22} />}
                    </Link>
                  </div>
                )}
              </div>

              <div className="pt-8 border-t border-white/10">
                {user ? (
                  <div className="space-y-4">
                    <button 
                      onClick={logout} 
                      className="w-full flex items-center space-x-3 p-5 bg-red-600/10 text-red-500 border border-red-500/20 rounded-2xl font-black justify-center hover:bg-red-600 hover:text-white transition-all active:scale-95"
                    >
                      <LogOut size={22} />
                      <span>Sair da Conta</span>
                    </button>
                  </div>
                ) : (
                  <Link 
                    to="/auth" 
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center space-x-3 p-6 bg-blue-600 text-white rounded-2xl font-black text-center justify-center shadow-2xl shadow-blue-900/50"
                  >
                    <UserIcon size={22} />
                    <span>Aceder Agora</span>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </nav>

        <AdminSubNav />

        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<HomePage products={products} addToCart={addToCart} user={user} />} />
            <Route path="/catalog" element={<CatalogPage products={products} addToCart={addToCart} user={user} />} />
            <Route path="/product/:id" element={<ProductDetailsPage products={products} addToCart={addToCart} user={user} />} />
            <Route path="/cart" element={<CartPage cart={cart} updateQuantity={updateQuantity} removeFromCart={removeFromCart} />} />
            <Route path="/checkout" element={<CheckoutPage cart={cart} user={user} clearCart={clearCart} onOrderComplete={addOrder} />} />
            <Route path="/auth" element={<AuthPage setUser={setUser} />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/profile" element={<ProfilePage user={user} orders={orders} />} />
            
            {/* Admin Routes */}
            <Route path="/admin" element={<AdminDashboard orders={orders} products={products} />} />
            <Route path="/admin/inventory" element={<AdminInventory 
              products={products} 
              onAdd={(p) => handleUpdateProducts([p, ...products])}
              onUpdate={(p) => handleUpdateProducts(products.map(old => old.id === p.id ? p : old))}
              onDelete={handleDeleteProduct}
            />} />
            <Route path="/admin/reports" element={<AdminReports orders={orders} />} />
          </Routes>
        </main>

        <footer className="bg-white border-t border-gray-100 py-16 print:hidden">
          <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-12">
            <div className="col-span-1 md:col-span-2">
              <Link to="/" className="flex items-center space-x-3 mb-6">
                <div className="bg-blue-600 p-2 rounded-lg"><Package className="text-white" size={20} /></div>
                <span className="text-xl font-black text-gray-900 uppercase">AutoPeças<span className="text-blue-600">Pro</span></span>
              </Link>
              <p className="text-gray-500 font-medium leading-relaxed max-w-sm">
                Líderes no mercado angolano de peças automotivas premium. Qualidade certificada e suporte técnico especializado para todas as marcas.
              </p>
            </div>
            <div>
              <h4 className="font-black text-gray-900 uppercase text-xs tracking-widest mb-6">Navegação</h4>
              <ul className="space-y-4 text-sm font-bold text-gray-500">
                <li><Link to="/catalog" className="hover:text-blue-600 transition">Peças por Marca</Link></li>
                <li><Link to="/about" className="hover:text-blue-600 transition">Sobre a Empresa</Link></li>
                <li><Link to="/contact" className="hover:text-blue-600 transition">Suporte Técnico</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-black text-gray-900 uppercase text-xs tracking-widest mb-6">Legal</h4>
              <ul className="space-y-4 text-sm font-bold text-gray-500">
                <li><Link to="/" className="hover:text-blue-600 transition">Termos de Uso</Link></li>
                <li><Link to="/" className="hover:text-blue-600 transition">Política de Privacidade</Link></li>
                <li className="text-xs text-gray-400 font-medium pt-4">NIF: 5417281902</li>
              </ul>
            </div>
          </div>
          <div className="max-w-7xl mx-auto px-4 mt-16 pt-8 border-t border-gray-50 text-center text-xs font-black text-gray-400 uppercase tracking-widest">
            © {new Date().getFullYear()} AutoPeças Pro Angola. Todos os direitos reservados.
          </div>
        </footer>

        {toast && <Toast message={toast} onClose={() => setToast(null)} />}
      </div>
    </HashRouter>
  );
};

export default App;

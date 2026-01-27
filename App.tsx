
import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, User as UserIcon, LogOut, Package, BarChart3, Menu, X, Settings } from 'lucide-react';
import { CartItem, User, Product } from './types';
import { MOCK_PRODUCTS } from './constants';

// Pages
import HomePage from './pages/HomePage';
import ProductDetailsPage from './pages/ProductDetailsPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import AuthPage from './pages/AuthPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import AdminDashboard from './pages/Admin/Dashboard';
import AdminInventory from './pages/Admin/Inventory';

const App: React.FC = () => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) setUser(JSON.parse(savedUser));
    
    const savedCart = localStorage.getItem('cart');
    if (savedCart) setCart(JSON.parse(savedCart));
  }, []);

  const addToCart = (product: Product) => {
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

  const logout = () => {
    localStorage.removeItem('user');
    setUser(null);
    window.location.hash = '#/auth';
  };

  return (
    <HashRouter>
      <div className="min-h-screen flex flex-col bg-gray-50">
        {/* Navigation */}
        <nav className="bg-gray-900 text-white sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16 items-center">
              <Link to="/" className="flex items-center space-x-2">
                <Package className="w-8 h-8 text-blue-500" />
                <span className="text-xl font-bold tracking-tight">AutoPeças <span className="text-blue-500">PRO</span></span>
              </Link>

              {/* Desktop Menu */}
              <div className="hidden md:flex items-center space-x-8">
                <Link to="/" className="hover:text-blue-400 transition">Loja</Link>
                <Link to="/about" className="hover:text-blue-400 transition">Sobre</Link>
                <Link to="/contact" className="hover:text-blue-400 transition">Contacto</Link>
                
                {user?.role === 'admin' && (
                  <Link to="/admin" className="flex items-center space-x-1 text-yellow-500 hover:text-yellow-400">
                    <Settings size={18} />
                    <span>Admin</span>
                  </Link>
                )}

                <div className="flex items-center space-x-4 border-l border-gray-700 pl-4">
                  <Link to="/cart" className="relative p-2 hover:bg-gray-800 rounded-full">
                    <ShoppingCart size={24} />
                    {cart.length > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full">
                        {cart.reduce((acc, i) => acc + i.quantity, 0)}
                      </span>
                    )}
                  </Link>
                  
                  {user ? (
                    <div className="flex items-center space-x-3">
                      <span className="text-sm font-medium hidden lg:inline">{user.name}</span>
                      <button onClick={logout} className="p-2 hover:bg-red-600/20 text-red-400 rounded-full transition">
                        <LogOut size={22} />
                      </button>
                    </div>
                  ) : (
                    <Link to="/auth" className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg font-medium transition">
                      <UserIcon size={18} />
                      <span>Entrar</span>
                    </Link>
                  )}
                </div>
              </div>

              {/* Mobile Menu Button */}
              <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden p-2">
                {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
              </button>
            </div>
          </div>

          {/* Mobile Sidebar */}
          {isMenuOpen && (
            <div className="md:hidden bg-gray-800 border-t border-gray-700 py-4 px-4 space-y-4">
              <Link to="/" onClick={() => setIsMenuOpen(false)} className="block py-2">Loja</Link>
              <Link to="/about" onClick={() => setIsMenuOpen(false)} className="block py-2">Sobre</Link>
              <Link to="/contact" onClick={() => setIsMenuOpen(false)} className="block py-2">Contacto</Link>
              {user?.role === 'admin' && <Link to="/admin" onClick={() => setIsMenuOpen(false)} className="block py-2 text-yellow-500">Painel Administrativo</Link>}
              <Link to="/cart" onClick={() => setIsMenuOpen(false)} className="block py-2">Carrinho ({cart.length})</Link>
              {!user ? (
                <Link to="/auth" onClick={() => setIsMenuOpen(false)} className="block py-2 text-blue-400">Login / Cadastro</Link>
              ) : (
                <button onClick={logout} className="block py-2 text-red-400">Sair</button>
              )}
            </div>
          )}
        </nav>

        {/* Content */}
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<HomePage addToCart={addToCart} />} />
            <Route path="/product/:id" element={<ProductDetailsPage addToCart={addToCart} />} />
            <Route path="/cart" element={<CartPage cart={cart} updateQuantity={updateQuantity} removeFromCart={removeFromCart} />} />
            <Route path="/checkout" element={<CheckoutPage cart={cart} user={user} clearCart={clearCart} />} />
            <Route path="/auth" element={<AuthPage setUser={setUser} />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            
            {/* Admin Protected Routes */}
            <Route path="/admin" element={user?.role === 'admin' ? <AdminDashboard /> : <AuthPage setUser={setUser} />} />
            <Route path="/admin/inventory" element={user?.role === 'admin' ? <AdminInventory /> : <AuthPage setUser={setUser} />} />
          </Routes>
        </main>

        {/* Footer */}
        <footer className="bg-gray-900 text-gray-400 py-12 border-t border-gray-800">
          <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 text-white mb-4">
                <Package className="w-6 h-6 text-blue-500" />
                <span className="text-lg font-bold">AutoPeças <span className="text-blue-500">PRO</span></span>
              </div>
              <p className="text-sm">Sua parceira de confiança em peças automotivas premium em Angola. Qualidade garantida para o seu veículo.</p>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4">Links Rápidos</h4>
              <ul className="space-y-2 text-sm">
                <li><Link to="/" className="hover:text-white">Loja</Link></li>
                <li><Link to="/about" className="hover:text-white">Sobre Nós</Link></li>
                <li><Link to="/contact" className="hover:text-white">Contacto</Link></li>
                <li><Link to="/privacy" className="hover:text-white">Privacidade</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4">Pagamento</h4>
              <ul className="space-y-2 text-sm">
                <li>Multicaixa Express</li>
                <li>Transferência IBAN</li>
                <li>Visa / Mastercard</li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4">Contacto</h4>
              <ul className="space-y-2 text-sm">
                <li>Luanda, Angola</li>
                <li>+244 923 000 000</li>
                <li>comercial@autopecaspro.com</li>
              </ul>
            </div>
          </div>
          <div className="max-w-7xl mx-auto px-4 mt-12 pt-8 border-t border-gray-800 text-center text-xs">
            © 2024 AutoPeças Pro. Todos os direitos reservados.
          </div>
        </footer>
      </div>
    </HashRouter>
  );
};

export default App;

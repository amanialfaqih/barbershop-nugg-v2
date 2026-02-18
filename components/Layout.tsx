
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Scissors, 
  Receipt, 
  BarChart3, 
  Menu, 
  X,
  LogOut,
  Wallet
} from 'lucide-react';

const navItems = [
  { path: '/', name: 'Dashboard', icon: LayoutDashboard },
  { path: '/services', name: 'Layanan', icon: Scissors },
  { path: '/transactions', name: 'Transaksi', icon: Receipt },
  { path: '/reports', name: 'Laporan', icon: BarChart3 },
];

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();

  const closeSidebar = () => setIsSidebarOpen(false);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex overflow-hidden">
      {/* Sidebar Desktop */}
      <aside className="hidden md:flex flex-col w-64 bg-slate-900 border-r border-amber-900/30 p-4">
        <div className="flex items-center gap-3 px-4 py-8">
          <div className="bg-amber-500 p-2 rounded-lg">
            <Scissors className="text-slate-950" size={24} />
          </div>
          <h1 className="text-xl font-serif font-bold text-amber-500 tracking-wider">BARBERSHOP-NUGG</h1>
        </div>
        
        <nav className="flex-1 space-y-2 mt-4">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                location.pathname === item.path 
                ? 'bg-amber-500/10 text-amber-400 border-r-4 border-amber-500' 
                : 'text-slate-400 hover:bg-slate-800 hover:text-slate-100'
              }`}
            >
              <item.icon size={20} />
              <span className="font-medium">{item.name}</span>
            </Link>
          ))}
        </nav>

        <div className="pt-4 mt-auto border-t border-slate-800">
          <button className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-red-400 w-full transition-colors">
            <LogOut size={20} />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>

      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-40 md:hidden"
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar Mobile */}
      <aside className={`fixed inset-y-0 left-0 w-64 bg-slate-900 z-50 transform transition-transform duration-300 md:hidden ${
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex items-center justify-between p-6">
          <div className="flex items-center gap-2">
            <Scissors className="text-amber-500" size={24} />
            <span className="text-lg font-serif font-bold text-amber-500">BARBERSHOP-NUGG</span>
          </div>
          <button onClick={closeSidebar} className="text-slate-400">
            <X size={24} />
          </button>
        </div>
        <nav className="p-4 space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={closeSidebar}
              className={`flex items-center gap-3 px-4 py-4 rounded-xl transition-all ${
                location.pathname === item.path 
                ? 'bg-amber-500/20 text-amber-400' 
                : 'text-slate-400'
              }`}
            >
              <item.icon size={20} />
              <span className="font-medium">{item.name}</span>
            </Link>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-slate-900/50 backdrop-blur-md border-b border-amber-900/10 flex items-center justify-between px-6 sticky top-0 z-30">
          <button 
            className="md:hidden text-slate-100 p-2"
            onClick={() => setIsSidebarOpen(true)}
          >
            <Menu size={24} />
          </button>
          
          <div className="flex-1 px-4 hidden md:block">
            <h2 className="text-lg font-semibold text-slate-300">
              {navItems.find(item => item.path === location.pathname)?.name || 'Halaman'}
            </h2>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex flex-col items-end mr-2">
              <span className="text-sm font-semibold text-slate-100">Admin Utama</span>
              <span className="text-xs text-amber-500 uppercase tracking-tighter font-bold">Manager</span>
            </div>
            <div className="w-10 h-10 rounded-full bg-amber-500 flex items-center justify-center text-slate-900 font-bold border-2 border-amber-500/30">
              A
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="max-w-7xl mx-auto space-y-8">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
};

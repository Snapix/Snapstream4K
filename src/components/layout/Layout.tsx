import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Search, Home as HomeIcon, Settings } from 'lucide-react';

export default function Layout() {
  const location = useLocation();
  
  return (
    <div className="flex flex-col min-h-screen bg-[#050505] text-white font-sans selection:bg-primary selection:text-primary-text">
      {/* Top Navigation */}
      <header className="sticky top-0 z-50 bg-[#050505]/80 backdrop-blur-xl border-b border-white/5 shadow-lg">
        <div className="max-w-[1600px] mx-auto px-4 md:px-8 lg:px-12 h-20 md:h-24 flex items-center justify-between">
          <Link to="/" className="text-2xl md:text-3xl font-black tracking-tighter text-white flex items-center gap-1 hover:scale-105 transition-transform">
            <span className="text-[var(--primary)]">SnapStream</span>4k.
          </Link>
          
          <nav className="flex gap-2 md:gap-4 items-center bg-white/5 p-1.5 md:p-2 rounded-full border border-white/10">
            <NavItem to="/" icon={<HomeIcon size={18} className="md:w-5 md:h-5" />} label="HOME" active={location.pathname === '/'} />
            <NavItem to="/search" icon={<Search size={18} className="md:w-5 md:h-5" />} label="SEARCH" active={location.pathname === '/search'} />
            <NavItem to="/settings" icon={<Settings size={18} className="md:w-5 md:h-5" />} label="SETTINGS" active={location.pathname === '/settings'} />
          </nav>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col w-full max-w-[1600px] mx-auto relative pt-6 md:pt-8">
        <Outlet />
      </main>
      
      {/* Footer */}
      <footer className="bg-[#111] py-8 md:py-12 px-6 md:px-8 flex flex-col justify-center items-center text-sm border-t border-white/5 mt-auto rounded-t-[32px] md:rounded-t-[40px]">
        <p className="font-bold uppercase tracking-widest text-[10px] md:text-xs text-gray-500">
          Made by <span className="text-primary">OKsnappy</span>
        </p>
      </footer>
    </div>
  );
}

function NavItem({ to, icon, label, active }: { to: string; icon: React.ReactNode; label: string; active: boolean }) {
  return (
    <Link 
      to={to} 
      className={`flex items-center gap-1.5 md:gap-2 px-3 md:px-5 py-2 md:py-2.5 rounded-full transition-all font-black text-xs md:text-sm tracking-widest uppercase ${
        active 
          ? 'bg-[var(--primary)] text-[var(--primary-text)]' 
          : 'text-gray-400 hover:text-white hover:bg-white/10'
      }`}
      style={active ? { boxShadow: `0 0 20px color-mix(in srgb, var(--primary) 30%, transparent)` } : {}}
    >
      {icon}
      <span className="hidden sm:inline">{label}</span>
    </Link>
  );
}

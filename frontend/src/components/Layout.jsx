import { Outlet, Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, Map, Package, Warehouse, Truck, Ship, 
  Zap, TrendingUp, Bell, FileText, Settings, User, Search, Sparkles, Home
} from 'lucide-react';

const navigation = [
  { name: 'Command Center', path: '/command-center', icon: LayoutDashboard },
  { name: 'Supply Chain Map', path: '/network', icon: Map },
  { name: 'Inventory', path: '/inventory', icon: Package },
  { name: 'Warehouses', path: '/warehouses', icon: Warehouse },
  { name: 'Shipments', path: '/shipments', icon: Ship },
  { name: 'Fleet Operations', path: '/fleet', icon: Truck },
  { name: 'AI Optimization', path: '/optimization', icon: Zap },
  { name: 'Predictive Analytics', path: '/analytics', icon: TrendingUp },
  { name: 'Insights & Alerts', path: '/alerts', icon: Bell },
  { name: 'Reports', path: '/reports', icon: FileText },
];

export default function Layout() {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-[#F4F7FB] text-slate-900 font-sans">
      {/* Sidebar */}
      <aside className="fixed inset-y-0 left-0 w-64 bg-[#0F172A] text-slate-300 flex flex-col z-30 shadow-xl border-r border-slate-800/80">
        {/* Logo */}
        <Link 
          to="/" 
          title="Return to Public Landing Page"
          className="h-20 flex items-center px-6 border-b border-slate-800/70 hover:bg-slate-800/40 transition-colors group"
        >
          <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-blue-500/30 group-hover:scale-105 transition-transform">
            <Truck className="h-5 w-5" />
          </div>
          <div className="ml-3">
            <div className="flex items-center gap-1.5">
              <h1 className="text-lg font-extrabold text-white tracking-tight">SC-LogiX</h1>
              <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-blue-500/20 text-blue-400 border border-blue-500/30">AI</span>
            </div>
            <p className="text-[11px] font-medium text-slate-400">Intelligent Logistics Hub</p>
          </div>
        </Link>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-5 space-y-1 overflow-y-auto">
          <p className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">Main Menu</p>
          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path || 
                            (item.path === '/command-center' && (location.pathname === '/' || location.pathname === '/dashboard'));
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group ${
                  isActive
                    ? 'bg-blue-600 text-white font-semibold shadow-md shadow-blue-600/30'
                    : 'text-slate-300 hover:bg-slate-800/70 hover:text-white'
                }`}
              >
                <Icon className={`h-4.5 w-4.5 mr-3 transition-transform duration-200 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-white group-hover:scale-110'}`} />
                <span>{item.name}</span>
                {isActive && (
                  <span className="ml-auto w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Bottom system status */}
        <div className="border-t border-slate-800/80 p-4 bg-slate-900/60">
          <div className="flex items-center justify-between text-xs px-2 py-1.5 rounded-lg bg-slate-800/50 border border-slate-700/50">
            <div className="flex items-center">
              <span className="relative flex h-2 w-2 mr-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="font-medium text-slate-300">Live AI Engine</span>
            </div>
            <span className="text-[10px] font-mono font-medium text-emerald-400">99.9%</span>
          </div>
          <div className="mt-3 flex items-center justify-between px-1">
            <button aria-label="Settings" className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors">
              <Settings className="h-4 w-4" />
            </button>
            <div className="text-right">
              <p className="text-[11px] font-semibold text-white">Ops Control</p>
              <p className="text-[10px] text-slate-400">v2.4 Active</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main content area */}
      <div className="pl-64 flex flex-col min-h-screen">
        {/* Top bar */}
        <header className="h-20 bg-white/80 backdrop-blur-md sticky top-0 z-20 border-b border-slate-100 flex items-center justify-between px-8">
          <div className="flex items-center space-x-4">
            <div>
              <h2 className="text-xl font-bold tracking-tight text-slate-900">
                {navigation.find(n => n.path === location.pathname)?.name || 'Command Center'}
              </h2>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-blue-600"></span>
                <p className="text-xs font-medium text-slate-500">
                  {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' })}
                </p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            {/* Link to public landing portal */}
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200/80 text-xs font-bold text-slate-700 transition-colors border border-slate-200"
              title="Return to Public Landing Page"
            >
              <Home className="h-3.5 w-3.5 text-slate-500" />
              <span>Public Portal</span>
            </Link>

            {/* Quick search affordance pill */}
            <div className="hidden md:flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-50 border border-slate-200 text-xs text-slate-400">
              <Search className="h-3.5 w-3.5 text-slate-400" />
              <span>Search loads, SKUs, drivers...</span>
              <kbd className="ml-2 font-mono text-[10px] bg-white px-1.5 py-0.5 rounded border border-slate-200 text-slate-500">⌘K</kbd>
            </div>

            {/* Notification bell pill button */}
            <Link 
              to="/alerts"
              className="relative p-2.5 rounded-full bg-white border border-slate-200/80 text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors shadow-sm"
              title="View Insights & Alerts"
            >
              <Bell className="h-4 w-4" />
              <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-rose-500 ring-2 ring-white"></span>
            </Link>

            {/* User profile avatar pill */}
            <div className="flex items-center pl-1">
              <Link 
                to="/signin"
                className="flex items-center gap-3 py-1 px-2 rounded-full border border-slate-200/80 bg-white shadow-sm hover:border-slate-300 transition-colors cursor-pointer"
                title="Account & Auth"
              >
                <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold text-xs shadow-inner">
                  OP
                </div>
                <div className="pr-2 text-left hidden sm:block">
                  <p className="text-xs font-bold text-slate-900 leading-none">Operations Hub</p>
                  <p className="text-[10px] font-medium text-slate-400 mt-0.5">Control Tower</p>
                </div>
              </Link>
            </div>
          </div>
        </header>

        {/* Page body */}
        <main className="flex-1 p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

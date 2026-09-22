import { Outlet, Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, Map, Package, Warehouse, Truck, Ship, 
  Zap, TrendingUp, Bell, FileText, Settings, User 
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
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 w-64 bg-gray-900 text-white">
        {/* Logo */}
        <div className="h-16 flex items-center px-6 border-b border-gray-800">
          <Truck className="h-8 w-8 text-primary-500" />
          <div className="ml-3">
            <h1 className="text-xl font-bold">SC-LogiX</h1>
            <p className="text-xs text-gray-400">Supply Chain AI</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path || 
                            (item.path === '/command-center' && location.pathname === '/');
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-primary-600 text-white'
                    : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                }`}
              >
                <Icon className="h-5 w-5 mr-3" />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* Bottom section */}
        <div className="border-t border-gray-800 p-4">
          <div className="flex items-center justify-between text-xs text-gray-400">
            <div className="flex items-center">
              <div className="h-2 w-2 rounded-full bg-success-500 mr-2"></div>
              System Active
            </div>
          </div>
          <div className="mt-4 flex items-center justify-between">
            <button className="p-2 hover:bg-gray-800 rounded-lg transition-colors">
              <Settings className="h-5 w-5 text-gray-400" />
            </button>
            <button className="p-2 hover:bg-gray-800 rounded-lg transition-colors">
              <User className="h-5 w-5 text-gray-400" />
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="pl-64">
        {/* Top bar */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
          <div className="flex items-center space-x-4">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                {navigation.find(n => n.path === location.pathname)?.name || 'Command Center'}
              </h2>
              <p className="text-sm text-gray-500">
                {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <button className="relative p-2 text-gray-400 hover:text-gray-600">
              <Bell className="h-5 w-5" />
              <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-danger-500"></span>
            </button>
            <div className="flex items-center space-x-3">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">Supply Chain Manager</p>
                <p className="text-xs text-gray-500">Operations Hub</p>
              </div>
              <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
                <User className="h-6 w-6 text-primary-600" />
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

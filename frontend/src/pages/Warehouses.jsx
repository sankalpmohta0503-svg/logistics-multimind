import { useState, useEffect } from 'react';
import { Warehouse, Package, TrendingUp } from 'lucide-react';
import StatusBadge from '../components/StatusBadge';
import { api } from '../services/api';

export default function Warehouses() {
  const [warehouses, setWarehouses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadWarehouses();
  }, []);

  const loadWarehouses = async () => {
    try {
      const data = await api.getWarehouses();
      setWarehouses(data);
    } catch (error) {
      console.error('Failed to load warehouses:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64">Loading warehouses...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {warehouses.map((wh) => (
          <div key={wh.id} className="card p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-bold text-gray-900">{wh.name}</h3>
                <p className="text-sm text-gray-600 mt-1">{wh.location}</p>
              </div>
              <Warehouse className="h-8 w-8 text-primary-600" />
            </div>

            {/* Capacity Bar */}
            <div className="mb-4">
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="text-gray-600">Capacity Utilization</span>
                <span className="font-semibold text-gray-900">{wh.utilization}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className={`h-3 rounded-full transition-all ${
                    wh.utilization > 85 ? 'bg-danger-600' :
                    wh.utilization > 70 ? 'bg-warning-600' :
                    'bg-success-600'
                  }`}
                  style={{ width: `${wh.utilization}%` }}
                ></div>
              </div>
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>{wh.occupied.toLocaleString()} units</span>
                <span>{wh.capacity.toLocaleString()} max</span>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-200">
              <div>
                <p className="text-xs text-gray-600">SKU Count</p>
                <p className="text-lg font-semibold text-gray-900 mt-1">{wh.sku_count || 0}</p>
              </div>
              <div>
                <p className="text-xs text-gray-600">Inventory Value</p>
                <p className="text-lg font-semibold text-gray-900 mt-1">
                  ₹{((wh.inventory_value || 0) / 100000).toFixed(1)}L
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-600">Status</p>
                <div className="mt-1">
                  <StatusBadge status={
                    wh.utilization > 85 ? 'critical' :
                    wh.utilization > 70 ? 'warning' :
                    'healthy'
                  } />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

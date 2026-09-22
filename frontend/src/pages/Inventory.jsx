import { useState, useEffect } from 'react';
import { Package, AlertTriangle, TrendingUp, TrendingDown } from 'lucide-react';
import StatusBadge from '../components/StatusBadge';
import { api } from '../services/api';

export default function Inventory() {
  const [inventoryRisks, setInventoryRisks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadInventoryRisks();
  }, []);

  const loadInventoryRisks = async () => {
    try {
      const data = await api.getInventoryRisks();
      setInventoryRisks(data);
    } catch (error) {
      console.error('Failed to load inventory risks:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64">Loading inventory...</div>;
  }

  const criticalItems = inventoryRisks.filter(i => i.risk_level === 'critical');
  const highRiskItems = inventoryRisks.filter(i => i.risk_level === 'high');
  const overstockItems = inventoryRisks.filter(i => i.risk_level === 'overstock');

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total SKUs</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{inventoryRisks.length}</p>
            </div>
            <Package className="h-10 w-10 text-primary-600" />
          </div>
        </div>
        
        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Critical Stockout Risk</p>
              <p className="text-3xl font-bold text-danger-600 mt-2">{criticalItems.length}</p>
            </div>
            <AlertTriangle className="h-10 w-10 text-danger-600" />
          </div>
        </div>
        
        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">High Risk Items</p>
              <p className="text-3xl font-bold text-warning-600 mt-2">{highRiskItems.length}</p>
            </div>
            <TrendingDown className="h-10 w-10 text-warning-600" />
          </div>
        </div>
        
        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Overstock Items</p>
              <p className="text-3xl font-bold text-purple-600 mt-2">{overstockItems.length}</p>
            </div>
            <TrendingUp className="h-10 w-10 text-purple-600" />
          </div>
        </div>
      </div>

      {/* Inventory Risk Radar */}
      <div className="card p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Inventory Risk Radar</h2>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">SKU</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Warehouse</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Current Stock</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Daily Demand</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Days Remaining</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Stockout Risk</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Risk Level</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Recommended Action</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {inventoryRisks.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.sku}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{item.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{item.warehouse_name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.quantity}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{item.avg_daily_demand}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.days_remaining}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                        <div 
                          className={`h-2 rounded-full ${
                            item.stockout_probability > 70 ? 'bg-danger-600' :
                            item.stockout_probability > 40 ? 'bg-warning-600' :
                            'bg-success-600'
                          }`}
                          style={{ width: `${Math.min(100, item.stockout_probability)}%` }}
                        ></div>
                      </div>
                      <span className="text-sm text-gray-700">{item.stockout_probability}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <StatusBadge status={item.risk_level} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {item.recommended_reorder ? (
                      <button className="text-primary-600 hover:text-primary-800 font-medium">
                        Reorder {item.recommended_reorder} units
                      </button>
                    ) : (
                      <span className="text-gray-400">Monitor</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

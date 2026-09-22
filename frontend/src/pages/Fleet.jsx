import { useState, useEffect } from 'react';
import { Truck } from 'lucide-react';
import StatusBadge from '../components/StatusBadge';
import { api } from '../services/api';

export default function Fleet() {
  const [fleetData, setFleetData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFleet();
  }, []);

  const loadFleet = async () => {
    try {
      const data = await api.getFleet();
      setFleetData(data);
    } catch (error) {
      console.error('Failed to load fleet:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64">Loading fleet...</div>;
  }

  if (!fleetData) return null;

  const { vehicles, stats } = fleetData;

  return (
    <div className="space-y-6">
      {/* Fleet Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <div className="card p-6">
          <p className="text-sm text-gray-600">Total Vehicles</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{stats.total}</p>
        </div>
        <div className="card p-6">
          <p className="text-sm text-gray-600">Active</p>
          <p className="text-3xl font-bold text-success-600 mt-2">{stats.active}</p>
        </div>
        <div className="card p-6">
          <p className="text-sm text-gray-600">Idle</p>
          <p className="text-3xl font-bold text-gray-600 mt-2">{stats.idle}</p>
        </div>
        <div className="card p-6">
          <p className="text-sm text-gray-600">Avg Utilization</p>
          <p className="text-3xl font-bold text-primary-600 mt-2">{stats.avgUtilization}%</p>
        </div>
        <div className="card p-6">
          <p className="text-sm text-gray-600">Avg Fuel Efficiency</p>
          <p className="text-3xl font-bold text-primary-600 mt-2">{stats.avgFuelEfficiency} km/L</p>
        </div>
      </div>

      {/* Vehicles Table */}
      <div className="card p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Fleet Overview</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Vehicle ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Driver</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Capacity</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Current Load</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Utilization</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fuel Efficiency</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {vehicles.map((vehicle) => (
                <tr key={vehicle.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {vehicle.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {vehicle.type}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {vehicle.driver_name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {vehicle.capacity_kg} kg
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {vehicle.current_load_kg} kg
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                        <div 
                          className={`h-2 rounded-full ${
                            vehicle.utilization > 90 ? 'bg-danger-600' :
                            vehicle.utilization > 70 ? 'bg-warning-600' :
                            'bg-success-600'
                          }`}
                          style={{ width: `${vehicle.utilization}%` }}
                        ></div>
                      </div>
                      <span className="text-sm text-gray-700">{vehicle.utilization}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {vehicle.fuel_efficiency} km/L
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <StatusBadge status={vehicle.status} />
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

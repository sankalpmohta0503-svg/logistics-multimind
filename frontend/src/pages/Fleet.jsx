import { useState, useEffect, useMemo } from 'react';
import { 
  Truck, User, Gauge, Fuel, AlertTriangle, CheckCircle, Clock, 
  Search, Download, RefreshCw, Wrench, ShieldAlert, Sparkles, 
  X, ArrowUpRight, Activity, Eye, LayoutGrid, List, Navigation
} from 'lucide-react';
import StatusBadge from '../components/StatusBadge';
import { api } from '../services/api';

export default function Fleet() {
  const [fleetData, setFleetData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('table'); // 'table' or 'grid'
  const [selectedVehicle, setSelectedVehicle] = useState(null);

  const loadFleet = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await api.getFleet();
      setFleetData(data);
    } catch (err) {
      console.error('Failed to load fleet telemetry:', err);
      setError(err.message || 'Failed to load fleet telemetry.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFleet();
  }, []);

  const { vehicles = [], stats = {} } = fleetData || {};

  // Extract unique vehicle types
  const vehicleTypes = useMemo(() => {
    const set = new Set();
    vehicles.forEach(v => {
      if (v.type) set.add(v.type);
    });
    return Array.from(set);
  }, [vehicles]);

  // Filtered vehicles
  const filteredVehicles = useMemo(() => {
    return vehicles.filter(v => {
      const term = searchTerm.toLowerCase();
      const matchesSearch = 
        v.id?.toLowerCase().includes(term) ||
        v.driver_name?.toLowerCase().includes(term) ||
        v.type?.toLowerCase().includes(term);

      const matchesStatus = 
        statusFilter === 'all' ? true : v.status === statusFilter;

      const matchesType = 
        typeFilter === 'all' ? true : v.type === typeFilter;

      return matchesSearch && matchesStatus && matchesType;
    });
  }, [vehicles, searchTerm, statusFilter, typeFilter]);

  if (loading && !fleetData) {
    return (
      <div className="flex min-h-[460px] items-center justify-center">
        <div className="card p-8 text-center max-w-sm border-slate-100 shadow-sm">
          <div className="h-12 w-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-4 border border-blue-100">
            <RefreshCw className="h-6 w-6 animate-spin text-blue-600" />
          </div>
          <h3 className="text-base font-bold text-slate-900">Synchronizing Fleet Telematics</h3>
          <p className="mt-1.5 text-xs text-slate-500">Connecting to onboard vehicle GPS gateways, engine OBD units, and fuel sensors...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* 1. Header & Actions */}
      <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600">Fleet Operations & Telematics</span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-100">Live Vehicle Mesh</span>
          </div>
          <h1 className="mt-1 text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
            Carrier Fleet & Telematics Hub
          </h1>
          <p className="mt-1 max-w-2xl text-xs sm:text-sm font-medium text-slate-500">
            Real-time payload utilization, fuel efficiency telemetry, driver assignments, and preventive maintenance horizons.
          </p>
        </div>

        {/* Action Toolbar */}
        <div className="flex flex-wrap items-center gap-3">
          <button 
            type="button"
            onClick={() => window.print()}
            className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-colors shadow-sm"
          >
            <Download className="h-3.5 w-3.5 text-slate-400" />
            <span>Export Fleet Log</span>
          </button>

          <button 
            onClick={loadFleet} 
            disabled={loading}
            className="btn btn-primary inline-flex items-center gap-2 text-xs font-bold px-5 py-2.5 shadow-md shadow-blue-500/25"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>{loading ? 'Polling...' : 'Poll Telematics'}</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="flex items-start justify-between gap-4 rounded-2xl border border-rose-200 bg-rose-50/80 p-4 text-sm text-rose-800 shadow-sm">
          <div className="flex items-center gap-2.5">
            <AlertTriangle className="h-4 w-4 text-rose-600 shrink-0" />
            <span>{error}</span>
          </div>
          <button className="font-semibold underline hover:text-rose-950" onClick={loadFleet}>Retry</button>
        </div>
      )}

      {/* 2. Compact Integrated Fleet Telemetry Ribbon (No 4 bulky flashcards) */}
      <div className="card p-4 border-slate-100 bg-white shadow-sm">
        <div className="grid grid-cols-2 sm:grid-cols-5 divide-y sm:divide-y-0 sm:divide-x divide-slate-100">
          <div className="px-4 py-2">
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Total Fleet</p>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="text-2xl font-black text-slate-900">{stats.total || vehicles.length}</span>
              <span className="text-xs font-semibold text-slate-500">Vehicles</span>
            </div>
          </div>

          <div className="px-4 py-2">
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">In Transit (Active)</p>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="text-2xl font-black text-blue-600">{stats.active || 0}</span>
              <span className="text-xs font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full">
                On Route
              </span>
            </div>
          </div>

          <div className="px-4 py-2">
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Standby / Available</p>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="text-2xl font-black text-emerald-600">{stats.idle || 0}</span>
              <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                Ready
              </span>
            </div>
          </div>

          <div className="px-4 py-2">
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Active Utilization</p>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="text-2xl font-black text-slate-900">{stats.avgUtilization || 0}%</span>
              <span className="text-xs font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full">
                In-Transit
              </span>
            </div>
          </div>

          <div className="px-4 py-2 col-span-2 sm:col-span-1">
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Mean Fuel Economy</p>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="text-2xl font-black text-slate-900">{stats.avgFuelEfficiency || 0}</span>
              <span className="text-xs font-medium text-slate-500">km/L</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Filter Toolbar & Search Bar */}
      <div className="card p-4 border-slate-100 flex flex-col lg:flex-row lg:items-center justify-between gap-4 shadow-sm">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input 
            type="text"
            placeholder="Search Vehicle ID, Driver Name, or Type..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-full border border-slate-200 bg-slate-50/70 text-xs font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
          />
          {searchTerm && (
            <button 
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 font-bold"
            >
              ×
            </button>
          )}
        </div>

        {/* Filter Pills & View Mode */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Status Pills */}
          <div className="flex items-center gap-1 p-1 bg-slate-100/80 rounded-full border border-slate-200/60 overflow-x-auto">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                statusFilter === 'all' 
                  ? 'bg-white text-slate-900 shadow-xs' 
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All ({vehicles.length})
            </button>
            <button
              onClick={() => setStatusFilter('in_transit')}
              className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                statusFilter === 'in_transit' 
                  ? 'bg-blue-600 text-white shadow-xs' 
                  : 'text-blue-600 hover:text-blue-800'
              }`}
            >
              In Transit ({stats.active || 0})
            </button>
            <button
              onClick={() => setStatusFilter('available')}
              className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                statusFilter === 'available' 
                  ? 'bg-emerald-600 text-white shadow-xs' 
                  : 'text-emerald-700 hover:text-emerald-900'
              }`}
            >
              Available ({stats.idle || 0})
            </button>
            <button
              onClick={() => setStatusFilter('maintenance')}
              className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                statusFilter === 'maintenance' 
                  ? 'bg-amber-500 text-white shadow-xs' 
                  : 'text-amber-700 hover:text-amber-900'
              }`}
            >
              Maintenance ({stats.maintenance || 0})
            </button>
          </div>

          {/* Vehicle Type Filter */}
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-3.5 py-1.5 rounded-full border border-slate-200 bg-white text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
          >
            <option value="all">All Vehicle Types</option>
            {vehicleTypes.map(t => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>

          {/* View Mode Toggle Button Group */}
          <div className="hidden sm:flex items-center gap-1 p-1 bg-slate-100 rounded-full border border-slate-200">
            <button
              onClick={() => setViewMode('table')}
              title="Table View"
              className={`p-1.5 rounded-full transition-all ${
                viewMode === 'table' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-400 hover:text-slate-700'
              }`}
            >
              <List className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              title="Card Grid View"
              className={`p-1.5 rounded-full transition-all ${
                viewMode === 'grid' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-400 hover:text-slate-700'
              }`}
            >
              <LayoutGrid className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* 4. Vehicles Data Presentation (Table or Grid View) */}
      {filteredVehicles.length === 0 ? (
        <div className="card p-12 text-center border-slate-100 shadow-sm">
          <Truck className="mx-auto h-10 w-10 text-slate-300" />
          <h3 className="mt-3 text-sm font-bold text-slate-900">No vehicles match filters</h3>
          <p className="mt-1 text-xs text-slate-500">Try adjusting your search query or vehicle type filter.</p>
          <button 
            onClick={() => { setSearchTerm(''); setStatusFilter('all'); setTypeFilter('all'); }} 
            className="btn btn-secondary mt-4 text-xs font-semibold"
          >
            Reset Filters
          </button>
        </div>
      ) : viewMode === 'grid' ? (
        /* Card Grid View (Inspired by Reference Image 2 Vehicle Card) */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredVehicles.map((vehicle) => {
            const isTransit = vehicle.status === 'in_transit';
            const isMaintenance = vehicle.status === 'maintenance';

            return (
              <div 
                key={vehicle.id}
                onClick={() => setSelectedVehicle(vehicle)}
                className="card p-5 border-slate-100 hover:shadow-card-hover transition-all duration-300 cursor-pointer group relative overflow-hidden"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                        {vehicle.id}
                      </span>
                      <StatusBadge status={vehicle.status} />
                    </div>
                    <h3 className="text-base font-extrabold text-slate-900 mt-2 group-hover:text-blue-600 transition-colors">
                      {vehicle.type}
                    </h3>
                  </div>

                  <div className={`p-2.5 rounded-xl shrink-0 ${
                    isTransit ? 'bg-blue-50 text-blue-600' :
                    isMaintenance ? 'bg-amber-50 text-amber-600' :
                    'bg-emerald-50 text-emerald-600'
                  }`}>
                    <Truck className="h-5 w-5" />
                  </div>
                </div>

                {/* Driver Profile */}
                <div className="mt-4 flex items-center gap-2.5 p-2.5 rounded-xl bg-slate-50/70 border border-slate-100">
                  <div className="h-7 w-7 rounded-full bg-slate-200 flex items-center justify-center text-[10px] font-bold text-slate-700 shrink-0">
                    {vehicle.driver_name?.split(' ').map(n => n[0]).join('') || 'DR'}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-slate-900 truncate">{vehicle.driver_name || 'Unassigned Driver'}</p>
                    <p className="text-[10px] text-slate-400">Assigned Driver</p>
                  </div>
                </div>

                {/* Load Utilization Meter */}
                <div className="mt-4 space-y-1.5">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-slate-500">Payload Load</span>
                    <span className="text-slate-900 font-extrabold">{vehicle.utilization}%</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden flex">
                    <div 
                      className={`h-2 rounded-full transition-all ${
                        vehicle.utilization > 90 ? 'bg-rose-500' :
                        vehicle.utilization > 70 ? 'bg-amber-500' :
                        'bg-blue-500'
                      }`}
                      style={{ width: `${Math.min(100, vehicle.utilization)}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-[10px] text-slate-400">
                    <span>{vehicle.current_load_kg?.toLocaleString() || 0} kg load</span>
                    <span>{vehicle.capacity_kg?.toLocaleString()} kg max</span>
                  </div>
                </div>

                {/* Quick Stats Grid */}
                <div className="mt-4 pt-3 border-t border-slate-100 grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Fuel Economy</span>
                    <span className="font-bold text-slate-800">{vehicle.fuel_efficiency} km/L</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Service Horizon</span>
                    <span className="font-medium text-slate-600">{vehicle.maintenance_due || 'Up to date'}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* High-Density Data Table View */
        <div className="card border-slate-100 overflow-hidden shadow-sm">
          <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Truck className="h-4 w-4 text-blue-600" />
              <h2 className="text-base font-bold text-slate-900 tracking-tight">Active Carrier Telematics Registry</h2>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                {filteredVehicles.length} Units
              </span>
            </div>
            <div className="text-xs text-slate-400 font-medium">Click row for diagnostics</div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-100">
              <thead>
                <tr className="bg-slate-50/70">
                  <th scope="col" className="px-5 py-3.5 text-left text-[11px] font-bold uppercase tracking-wider text-slate-500">
                    Vehicle ID & Type
                  </th>
                  <th scope="col" className="px-5 py-3.5 text-left text-[11px] font-bold uppercase tracking-wider text-slate-500">
                    Driver Profile
                  </th>
                  <th scope="col" className="px-5 py-3.5 text-left text-[11px] font-bold uppercase tracking-wider text-slate-500">
                    Payload / Max Capacity
                  </th>
                  <th scope="col" className="px-5 py-3.5 text-left text-[11px] font-bold uppercase tracking-wider text-slate-500">
                    Load Utilization
                  </th>
                  <th scope="col" className="px-5 py-3.5 text-left text-[11px] font-bold uppercase tracking-wider text-slate-500">
                    Fuel Economy
                  </th>
                  <th scope="col" className="px-5 py-3.5 text-left text-[11px] font-bold uppercase tracking-wider text-slate-500">
                    Maintenance Due
                  </th>
                  <th scope="col" className="px-5 py-3.5 text-left text-[11px] font-bold uppercase tracking-wider text-slate-500">
                    Telematics Status
                  </th>
                  <th scope="col" className="px-5 py-3.5 text-right text-[11px] font-bold uppercase tracking-wider text-slate-500">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-100">
                {filteredVehicles.map((vehicle) => {
                  const isTransit = vehicle.status === 'in_transit';
                  const isMaintenance = vehicle.status === 'maintenance';

                  return (
                    <tr 
                      key={vehicle.id} 
                      onClick={() => setSelectedVehicle(vehicle)}
                      className="hover:bg-blue-50/40 transition-colors group cursor-pointer"
                    >
                      {/* ID & Type */}
                      <td className="px-5 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className={`h-8 w-8 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 ${
                            isTransit ? 'bg-blue-50 text-blue-600 border border-blue-100' :
                            isMaintenance ? 'bg-amber-50 text-amber-600 border border-amber-100' :
                            'bg-emerald-50 text-emerald-600 border border-emerald-100'
                          }`}>
                            <Truck className="h-4 w-4" />
                          </div>
                          <div>
                            <span className="font-mono text-xs font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                              {vehicle.id}
                            </span>
                            <div className="text-[10px] text-slate-400 font-medium">
                              {vehicle.type}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Driver */}
                      <td className="px-5 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <div className="h-6 w-6 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-600 shrink-0">
                            {vehicle.driver_name?.split(' ').map(n => n[0]).join('') || 'DR'}
                          </div>
                          <span className="text-xs font-bold text-slate-800">{vehicle.driver_name || 'Unassigned'}</span>
                        </div>
                      </td>

                      {/* Payload / Capacity */}
                      <td className="px-5 py-4 whitespace-nowrap">
                        <div className="text-xs font-bold text-slate-900">
                          {Number(vehicle.current_load_kg || 0).toLocaleString()} <span className="text-[10px] font-normal text-slate-400">kg</span>
                        </div>
                        <div className="text-[10px] text-slate-400">
                          Max: {Number(vehicle.capacity_kg).toLocaleString()} kg
                        </div>
                      </td>

                      {/* Utilization */}
                      <td className="px-5 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <div className="w-16 bg-slate-100 rounded-full h-2 overflow-hidden flex">
                            <div 
                              className={`h-2 rounded-full transition-all ${
                                vehicle.utilization > 90 ? 'bg-rose-500' :
                                vehicle.utilization > 70 ? 'bg-amber-500' :
                                'bg-blue-500'
                              }`}
                              style={{ width: `${Math.min(100, vehicle.utilization)}%` }}
                            />
                          </div>
                          <span className="text-xs font-mono font-bold text-slate-700">{vehicle.utilization}%</span>
                        </div>
                      </td>

                      {/* Fuel Efficiency */}
                      <td className="px-5 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
                          <Fuel className="h-3.5 w-3.5 text-slate-400" />
                          <span>{vehicle.fuel_efficiency}</span>
                          <span className="text-[10px] font-normal text-slate-400">km/L</span>
                        </div>
                      </td>

                      {/* Maintenance Due */}
                      <td className="px-5 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-1.5 text-xs font-medium text-slate-600">
                          <Wrench className="h-3.5 w-3.5 text-slate-400" />
                          <span>{vehicle.maintenance_due ? new Date(vehicle.maintenance_due).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' }) : 'Optimal'}</span>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="px-5 py-4 whitespace-nowrap">
                        <StatusBadge status={vehicle.status} />
                      </td>

                      {/* Action */}
                      <td className="px-5 py-4 whitespace-nowrap text-right">
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedVehicle(vehicle);
                          }}
                          className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-800 bg-blue-50/80 hover:bg-blue-100/80 px-2.5 py-1 rounded-full border border-blue-100 transition-colors"
                        >
                          <Eye className="h-3 w-3" />
                          <span>Inspect</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 5. Telematics Detail Modal for Selected Vehicle */}
      {selectedVehicle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-fadeIn">
          <div className="card w-full max-w-lg p-6 bg-white border-slate-100 shadow-2xl relative">
            <button 
              onClick={() => setSelectedVehicle(null)}
              className="absolute top-5 right-5 p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="flex items-center gap-2 mb-1">
              <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-100">
                {selectedVehicle.id}
              </span>
              <StatusBadge status={selectedVehicle.status} />
              <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                {selectedVehicle.type}
              </span>
            </div>

            <h3 className="text-xl font-extrabold text-slate-900 mt-2">
              Vehicle Telematics & Engine OBD
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">Assigned to: <strong className="text-slate-800">{selectedVehicle.driver_name || 'Unassigned'}</strong></p>

            <div className="mt-5 p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500">Engine Telematics Health</span>
                <span className="font-bold text-emerald-600 flex items-center gap-1">
                  <CheckCircle className="h-3.5 w-3.5" /> Nominal 100%
                </span>
              </div>

              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500">Payload Weight</span>
                <span className="font-bold text-slate-900">
                  {Number(selectedVehicle.current_load_kg || 0).toLocaleString()} / {Number(selectedVehicle.capacity_kg).toLocaleString()} kg ({selectedVehicle.utilization}%)
                </span>
              </div>

              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500">Fuel Economy Index</span>
                <span className="font-bold text-slate-800">{selectedVehicle.fuel_efficiency} km/L</span>
              </div>

              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500">Preventive Maintenance Schedule</span>
                <span className="font-bold text-slate-800">{selectedVehicle.maintenance_due || 'Standard Schedule'}</span>
              </div>

              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500">Active Freight Assignments</span>
                <span className="font-bold text-blue-600">{selectedVehicle.active_shipments || 0} Loads in Transit</span>
              </div>
            </div>

            <div className="mt-5 flex justify-end gap-2">
              <button 
                onClick={() => setSelectedVehicle(null)}
                className="btn btn-secondary text-xs px-4 py-2"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

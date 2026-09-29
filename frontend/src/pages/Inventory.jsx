import { useState, useEffect, useMemo } from 'react';
import { 
  Package, AlertTriangle, TrendingUp, TrendingDown, RefreshCw, 
  Search, Filter, ArrowUpRight, Warehouse, CheckCircle, 
  ArrowRight, ShieldAlert, Sparkles, Download, Layers, Clock, AlertCircle
} from 'lucide-react';
import StatusBadge from '../components/StatusBadge';
import { api } from '../services/api';

export default function Inventory() {
  const [inventoryRisks, setInventoryRisks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRiskFilter, setSelectedRiskFilter] = useState('all');
  const [selectedWarehouse, setSelectedWarehouse] = useState('all');
  const [reorderedItems, setReorderedItems] = useState({});
  const [actionMessage, setActionMessage] = useState('');

  const loadInventoryRisks = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await api.getInventoryRisks();
      setInventoryRisks(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to load inventory risks:', err);
      setError(err.message || 'Failed to load inventory telemetry.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInventoryRisks();
  }, []);

  const handleSimulatedReorder = (item) => {
    setReorderedItems(prev => ({ ...prev, [item.id]: true }));
    setActionMessage(`Procurement PO initiated for ${item.recommended_reorder || 500} units of ${item.name} (${item.sku}). Estimated lead time: ${item.lead_time_days || 7} days.`);
  };

  // Extract unique warehouses for filter
  const warehouses = useMemo(() => {
    const set = new Set();
    inventoryRisks.forEach(item => {
      if (item.warehouse_name) set.add(item.warehouse_name);
    });
    return Array.from(set);
  }, [inventoryRisks]);

  // Filtered inventory list
  const filteredItems = useMemo(() => {
    return inventoryRisks.filter(item => {
      const matchesSearch = 
        item.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.sku?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.warehouse_name?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesRisk = 
        selectedRiskFilter === 'all' ? true :
        selectedRiskFilter === 'critical' ? item.risk_level === 'critical' :
        selectedRiskFilter === 'high' ? item.risk_level === 'high' :
        selectedRiskFilter === 'overstock' ? item.risk_level === 'overstock' :
        selectedRiskFilter === 'normal' ? (item.risk_level === 'normal' || item.risk_level === 'low') : true;

      const matchesWh = 
        selectedWarehouse === 'all' ? true : item.warehouse_name === selectedWarehouse;

      return matchesSearch && matchesRisk && matchesWh;
    });
  }, [inventoryRisks, searchTerm, selectedRiskFilter, selectedWarehouse]);

  const criticalItems = inventoryRisks.filter(i => i.risk_level === 'critical');
  const highRiskItems = inventoryRisks.filter(i => i.risk_level === 'high');
  const overstockItems = inventoryRisks.filter(i => i.risk_level === 'overstock');
  const normalItems = inventoryRisks.filter(i => i.risk_level === 'normal' || i.risk_level === 'low');

  if (loading && inventoryRisks.length === 0) {
    return (
      <div className="flex min-h-[460px] items-center justify-center">
        <div className="card p-8 text-center max-w-sm border-slate-100 shadow-sm">
          <div className="h-12 w-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-4 border border-blue-100">
            <RefreshCw className="h-6 w-6 animate-spin text-blue-600" />
          </div>
          <h3 className="text-base font-bold text-slate-900">Auditing Warehouse Inventory</h3>
          <p className="mt-1.5 text-xs text-slate-500">Calculating safety thresholds, stockout risk probabilities, and lead time metrics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-7 animate-fadeIn">
      {/* 1. Header Greeting & Action Toolbar */}
      <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-center">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600">Inventory Telemetry</span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-100">Multi-Warehouse Radar</span>
          </div>
          <h1 className="mt-1 text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
            Inventory & Stock Risk Radar
          </h1>
          <p className="mt-1.5 max-w-2xl text-sm font-medium text-slate-500">
            Automated stockout probability modeling, safety replenishment thresholds, and SKU velocity tracking.
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
            <span>Export Stock Audit</span>
          </button>

          <button 
            onClick={loadInventoryRisks} 
            disabled={loading}
            className="btn btn-primary inline-flex items-center gap-2 text-xs font-bold px-5 py-2.5 shadow-md shadow-blue-500/25"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>{loading ? 'Refreshing...' : 'Audit Stock'}</span>
          </button>
        </div>
      </div>

      {/* Action Notification Toast */}
      {actionMessage && (
        <div className="flex items-center justify-between rounded-2xl border border-emerald-200 bg-emerald-50/90 p-4 text-sm text-emerald-800 shadow-sm animate-fadeIn">
          <div className="flex items-center gap-2.5">
            <CheckCircle className="h-4 w-4 text-emerald-600 shrink-0" />
            <span className="font-medium">{actionMessage}</span>
          </div>
          <button 
            onClick={() => setActionMessage('')} 
            className="text-xs font-semibold text-emerald-700 hover:text-emerald-900"
          >
            Dismiss
          </button>
        </div>
      )}

      {error && (
        <div className="flex items-start justify-between gap-4 rounded-2xl border border-rose-200 bg-rose-50/80 p-4 text-sm text-rose-800 shadow-sm">
          <div className="flex items-center gap-2.5">
            <AlertCircle className="h-4 w-4 text-rose-600 shrink-0" />
            <span>{error}</span>
          </div>
          <button className="font-semibold underline hover:text-rose-950" onClick={loadInventoryRisks}>Retry</button>
        </div>
      )}

      {/* 2. Flagship Metric & Accent Tile Grid (Matching Control Tower Theme) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Card 1: Total SKUs (Clean White Card with Micro Bar Chart) */}
        <div className="card p-5 relative overflow-hidden group hover:-translate-y-1 transition-all duration-300">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600 border border-blue-100/80">
                <Package className="h-5 w-5" />
              </div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Monitored SKUs</p>
            </div>
            <div className="p-1 text-slate-300 group-hover:text-blue-500 transition-colors">
              <ArrowUpRight className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-4 flex items-end justify-between">
            <div>
              <div className="text-4xl font-extrabold tracking-tight text-slate-900">{inventoryRisks.length}</div>
              <p className="mt-1 text-xs text-slate-500 font-medium">Across {warehouses.length || 4} regional hubs</p>
            </div>
            <div className="flex items-end gap-1 h-9 px-1">
              <div className="w-1.5 h-4 rounded-full bg-blue-400" title="Electronics"></div>
              <div className="w-1.5 h-7 rounded-full bg-blue-600" title="Tools"></div>
              <div className="w-1.5 h-5 rounded-full bg-indigo-500" title="Mechanical"></div>
              <div className="w-1.5 h-8 rounded-full bg-orange-400" title="Supplies"></div>
            </div>
          </div>
        </div>

        {/* Tile 2: Critical Stockout Risk (Saturated Coral Rose Tile) */}
        <div 
          onClick={() => setSelectedRiskFilter(selectedRiskFilter === 'critical' ? 'all' : 'critical')}
          className={`relative overflow-hidden rounded-2xl bg-gradient-to-br from-rose-500 to-rose-600 p-5 text-white shadow-md shadow-rose-500/15 hover:-translate-y-1 transition-all duration-300 cursor-pointer ${selectedRiskFilter === 'critical' ? 'ring-3 ring-rose-400 ring-offset-2' : ''}`}
        >
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/20 backdrop-blur-sm text-[11px] font-bold uppercase tracking-wider text-white">
              <AlertTriangle className="h-3 w-3" />
              Depletion Alert
            </span>
            <span className="text-xs font-bold text-white/80">&lt; 3 Days Left</span>
          </div>
          <div className="mt-4 flex items-baseline justify-between">
            <div>
              <div className="text-4xl font-black tracking-tight text-white">{criticalItems.length}</div>
              <p className="mt-0.5 text-xs font-medium text-rose-100">Critical Stockouts</p>
            </div>
            <div className="text-right">
              <span className="text-xs font-extrabold bg-white/25 px-2.5 py-1 rounded-lg text-white">
                Urgent PO
              </span>
            </div>
          </div>
        </div>

        {/* Tile 3: High Risk Items (Saturated Amber Tile) */}
        <div 
          onClick={() => setSelectedRiskFilter(selectedRiskFilter === 'high' ? 'all' : 'high')}
          className={`relative overflow-hidden rounded-2xl bg-gradient-to-br from-amber-400 to-amber-500 p-5 text-slate-900 shadow-md shadow-amber-500/15 hover:-translate-y-1 transition-all duration-300 cursor-pointer ${selectedRiskFilter === 'high' ? 'ring-3 ring-amber-400 ring-offset-2' : ''}`}
        >
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/30 backdrop-blur-sm text-[11px] font-bold uppercase tracking-wider text-slate-900">
              <TrendingDown className="h-3 w-3" />
              Watchlist
            </span>
            <span className="text-xs font-bold text-slate-900/80">&lt; 7 Days Left</span>
          </div>
          <div className="mt-4 flex items-baseline justify-between">
            <div>
              <div className="text-4xl font-black tracking-tight text-slate-900">{highRiskItems.length}</div>
              <p className="mt-0.5 text-xs font-bold text-slate-800">High Risk SKUs</p>
            </div>
            <div className="text-right">
              <span className="text-xs font-extrabold bg-white/40 px-2.5 py-1 rounded-lg text-slate-900">
                Reorder Watch
              </span>
            </div>
          </div>
        </div>

        {/* Tile 4: Overstock Items (Saturated Indigo Tile) */}
        <div 
          onClick={() => setSelectedRiskFilter(selectedRiskFilter === 'overstock' ? 'all' : 'overstock')}
          className={`relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-500 to-indigo-600 p-5 text-white shadow-md shadow-indigo-500/15 hover:-translate-y-1 transition-all duration-300 cursor-pointer ${selectedRiskFilter === 'overstock' ? 'ring-3 ring-indigo-400 ring-offset-2' : ''}`}
        >
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/20 backdrop-blur-sm text-[11px] font-bold uppercase tracking-wider text-white">
              <TrendingUp className="h-3 w-3" />
              Capital Lock
            </span>
            <span className="text-xs font-bold text-white/80">&gt; 3x Reorder Point</span>
          </div>
          <div className="mt-4 flex items-baseline justify-between">
            <div>
              <div className="text-4xl font-black tracking-tight text-white">{overstockItems.length}</div>
              <p className="mt-0.5 text-xs font-medium text-indigo-100">Overstock Items</p>
            </div>
            <div className="text-right">
              <span className="text-xs font-extrabold bg-white/20 px-2.5 py-1 rounded-lg text-white">
                Rebalance
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Filter Toolbar & Search Bar */}
      <div className="card p-4 border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input 
            type="text"
            placeholder="Search by SKU, Product Name, Category, or Warehouse..."
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

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Risk Level Pills */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-100/80 rounded-full border border-slate-200/60">
            <button
              onClick={() => setSelectedRiskFilter('all')}
              className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                selectedRiskFilter === 'all' 
                  ? 'bg-white text-slate-900 shadow-xs' 
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All ({inventoryRisks.length})
            </button>
            <button
              onClick={() => setSelectedRiskFilter('critical')}
              className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                selectedRiskFilter === 'critical' 
                  ? 'bg-rose-500 text-white shadow-xs' 
                  : 'text-rose-600 hover:text-rose-800'
              }`}
            >
              Critical ({criticalItems.length})
            </button>
            <button
              onClick={() => setSelectedRiskFilter('high')}
              className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                selectedRiskFilter === 'high' 
                  ? 'bg-amber-500 text-white shadow-xs' 
                  : 'text-amber-700 hover:text-amber-900'
              }`}
            >
              High ({highRiskItems.length})
            </button>
            <button
              onClick={() => setSelectedRiskFilter('overstock')}
              className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                selectedRiskFilter === 'overstock' 
                  ? 'bg-indigo-600 text-white shadow-xs' 
                  : 'text-indigo-600 hover:text-indigo-800'
              }`}
            >
              Overstock ({overstockItems.length})
            </button>
          </div>

          {/* Warehouse Dropdown Filter */}
          <select
            value={selectedWarehouse}
            onChange={(e) => setSelectedWarehouse(e.target.value)}
            className="px-3.5 py-1.5 rounded-full border border-slate-200 bg-white text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
          >
            <option value="all">All Regional Warehouses</option>
            {warehouses.map(wh => (
              <option key={wh} value={wh}>{wh}</option>
            ))}
          </select>
        </div>
      </div>

      {/* 4. Inventory Risk Radar Table */}
      <div className="card border-slate-100 overflow-hidden shadow-sm">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers className="h-4 w-4 text-blue-600" />
            <h2 className="text-base font-bold text-slate-900 tracking-tight">Stock Telemetry & Depletion Horizon</h2>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
              Showing {filteredItems.length} of {inventoryRisks.length} SKUs
            </span>
          </div>
        </div>

        {filteredItems.length === 0 ? (
          <div className="p-12 text-center">
            <Package className="mx-auto h-10 w-10 text-slate-300" />
            <h3 className="mt-3 text-sm font-bold text-slate-900">No matching SKUs found</h3>
            <p className="mt-1 text-xs text-slate-500">Try adjusting your search terms or risk filters.</p>
            <button 
              onClick={() => { setSearchTerm(''); setSelectedRiskFilter('all'); setSelectedWarehouse('all'); }} 
              className="btn btn-secondary mt-4 text-xs font-semibold"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-100">
              <thead>
                <tr className="bg-slate-50/70">
                  <th scope="col" className="px-5 py-3.5 text-left text-[11px] font-bold uppercase tracking-wider text-slate-500">
                    SKU & Product
                  </th>
                  <th scope="col" className="px-5 py-3.5 text-left text-[11px] font-bold uppercase tracking-wider text-slate-500">
                    Warehouse Hub
                  </th>
                  <th scope="col" className="px-5 py-3.5 text-left text-[11px] font-bold uppercase tracking-wider text-slate-500">
                    Current Stock / Min
                  </th>
                  <th scope="col" className="px-5 py-3.5 text-left text-[11px] font-bold uppercase tracking-wider text-slate-500">
                    Demand Velocity
                  </th>
                  <th scope="col" className="px-5 py-3.5 text-left text-[11px] font-bold uppercase tracking-wider text-slate-500">
                    Depletion Runway
                  </th>
                  <th scope="col" className="px-5 py-3.5 text-left text-[11px] font-bold uppercase tracking-wider text-slate-500">
                    Stockout Probability
                  </th>
                  <th scope="col" className="px-5 py-3.5 text-left text-[11px] font-bold uppercase tracking-wider text-slate-500">
                    Risk Status
                  </th>
                  <th scope="col" className="px-5 py-3.5 text-right text-[11px] font-bold uppercase tracking-wider text-slate-500">
                    Replenishment Action
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-100">
                {filteredItems.map((item) => {
                  const isReordered = reorderedItems[item.id];
                  const isCritical = item.risk_level === 'critical';
                  const isHigh = item.risk_level === 'high';
                  const isOverstock = item.risk_level === 'overstock';

                  return (
                    <tr key={item.id} className="hover:bg-slate-50/80 transition-colors group">
                      {/* SKU & Product */}
                      <td className="px-5 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className={`h-9 w-9 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 ${
                            isCritical ? 'bg-rose-50 text-rose-600 border border-rose-100' :
                            isHigh ? 'bg-amber-50 text-amber-600 border border-amber-100' :
                            isOverstock ? 'bg-indigo-50 text-indigo-600 border border-indigo-100' :
                            'bg-slate-50 text-slate-600 border border-slate-100'
                          }`}>
                            <Package className="h-4 w-4" />
                          </div>
                          <div>
                            <div className="text-xs font-extrabold text-slate-900 group-hover:text-blue-600 transition-colors">
                              {item.name}
                            </div>
                            <div className="flex items-center gap-2 mt-0.5">
                              <span className="font-mono text-[10px] font-bold text-slate-500 bg-slate-100 px-1.5 py-0.2 rounded">
                                {item.sku}
                              </span>
                              {item.category && (
                                <span className="text-[10px] font-medium text-slate-400">
                                  {item.category}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Warehouse Hub */}
                      <td className="px-5 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700">
                          <Warehouse className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                          <span className="truncate max-w-[160px]">{item.warehouse_name}</span>
                        </div>
                      </td>

                      {/* Current Stock / Min */}
                      <td className="px-5 py-4 whitespace-nowrap">
                        <div className="text-xs font-bold text-slate-900">
                          {Number(item.quantity || 0).toLocaleString()} <span className="text-[10px] font-normal text-slate-500">units</span>
                        </div>
                        {item.reorder_point && (
                          <div className="text-[10px] text-slate-400 mt-0.5">
                            Min ROP: {Number(item.reorder_point).toLocaleString()}
                          </div>
                        )}
                      </td>

                      {/* Demand Velocity */}
                      <td className="px-5 py-4 whitespace-nowrap">
                        <div className="text-xs font-semibold text-slate-700">
                          {item.avg_daily_demand || '—'} <span className="text-[10px] font-normal text-slate-400">units/day</span>
                        </div>
                        {item.lead_time_days && (
                          <div className="text-[10px] text-slate-400 mt-0.5 flex items-center gap-1">
                            <Clock className="h-2.5 w-2.5" />
                            {item.lead_time_days}d supplier lead
                          </div>
                        )}
                      </td>

                      {/* Depletion Runway */}
                      <td className="px-5 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${
                          Number(item.days_remaining) <= 3 
                            ? 'bg-rose-50 text-rose-700 border border-rose-200/60' 
                            : Number(item.days_remaining) <= 7 
                            ? 'bg-amber-50 text-amber-700 border border-amber-200/60' 
                            : 'bg-emerald-50 text-emerald-700 border border-emerald-200/60'
                        }`}>
                          {item.days_remaining != null ? `${item.days_remaining} Days` : '—'}
                        </span>
                      </td>

                      {/* Stockout Probability */}
                      <td className="px-5 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <div className="w-20 bg-slate-100 rounded-full h-2 overflow-hidden flex">
                            <div 
                              className={`h-2 rounded-full transition-all duration-500 ${
                                item.stockout_probability > 70 ? 'bg-rose-500' :
                                item.stockout_probability > 40 ? 'bg-amber-500' :
                                'bg-emerald-500'
                              }`}
                              style={{ width: `${Math.min(100, item.stockout_probability || 0)}%` }}
                            />
                          </div>
                          <span className={`text-xs font-mono font-bold ${
                            item.stockout_probability > 70 ? 'text-rose-600' :
                            item.stockout_probability > 40 ? 'text-amber-600' :
                            'text-slate-600'
                          }`}>
                            {item.stockout_probability}%
                          </span>
                        </div>
                      </td>

                      {/* Risk Level Badge */}
                      <td className="px-5 py-4 whitespace-nowrap">
                        <StatusBadge status={item.risk_level} />
                      </td>

                      {/* Recommended Action Button */}
                      <td className="px-5 py-4 whitespace-nowrap text-right">
                        {isReordered ? (
                          <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200/60">
                            <CheckCircle className="h-3.5 w-3.5" /> Ordered
                          </span>
                        ) : item.recommended_reorder ? (
                          <button 
                            onClick={() => handleSimulatedReorder(item)}
                            className="btn btn-primary inline-flex items-center gap-1.5 text-xs py-1.5 px-3.5 shadow-xs"
                          >
                            <Sparkles className="h-3 w-3 text-amber-300" />
                            Reorder {item.recommended_reorder}
                          </button>
                        ) : isOverstock ? (
                          <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full border border-indigo-100">
                            Rebalance
                          </span>
                        ) : (
                          <span className="text-xs font-medium text-slate-400">
                            Optimal
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

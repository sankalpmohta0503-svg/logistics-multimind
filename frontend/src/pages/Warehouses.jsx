import { useState, useEffect, useMemo } from 'react';
import { 
  Warehouse, Package, TrendingUp, AlertTriangle, MapPin, 
  Activity, ArrowUpRight, CheckCircle, Download, RefreshCw, 
  Layers, DollarSign, Boxes, ArrowRight, ShieldAlert, Sparkles, Filter
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { AreaChart, Area, ResponsiveContainer, Tooltip } from 'recharts';
import StatusBadge from '../components/StatusBadge';
import { api } from '../services/api';

const formatLakhs = (val) => `₹${((Number(val) || 0) / 100000).toFixed(1)}L`;

export default function Warehouses() {
  const [warehouses, setWarehouses] = useState([]);
  const [forecasts, setForecasts] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filterUtil, setFilterUtil] = useState('all');
  const [selectedWarehouseId, setSelectedWarehouseId] = useState(null);

  const loadData = async () => {
    setLoading(true);
    setError('');
    try {
      const [whData, forecastData] = await Promise.allSettled([
        api.getWarehouses(),
        api.getWarehouseCapacityForecast()
      ]);

      if (whData.status === 'fulfilled' && Array.isArray(whData.value)) {
        setWarehouses(whData.value);
      } else {
        throw new Error('Failed to fetch warehouses list.');
      }

      if (forecastData.status === 'fulfilled' && Array.isArray(forecastData.value)) {
        const forecastMap = {};
        forecastData.value.forEach(item => {
          forecastMap[item.warehouse_id] = item;
        });
        setForecasts(forecastMap);
      }
    } catch (err) {
      console.error('Error loading warehouse data:', err);
      setError(err.message || 'Failed to load warehouse data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Aggregated network metrics
  const totals = useMemo(() => {
    const totalCapacity = warehouses.reduce((acc, w) => acc + (w.capacity || 0), 0);
    const totalOccupied = warehouses.reduce((acc, w) => acc + (w.occupied || 0), 0);
    const totalValue = warehouses.reduce((acc, w) => acc + (w.inventory_value || 0), 0);
    const avgUtil = totalCapacity > 0 ? ((totalOccupied / totalCapacity) * 100).toFixed(1) : 0;
    const criticalHubs = warehouses.filter(w => (w.utilization || 0) > 85);
    const highHubs = warehouses.filter(w => (w.utilization || 0) > 75 && (w.utilization || 0) <= 85);

    return { totalCapacity, totalOccupied, totalValue, avgUtil, criticalHubs, highHubs };
  }, [warehouses]);

  // Filtered warehouses
  const filteredWarehouses = useMemo(() => {
    return warehouses.filter(w => {
      if (filterUtil === 'critical') return (w.utilization || 0) > 85;
      if (filterUtil === 'high') return (w.utilization || 0) > 75 && (w.utilization || 0) <= 85;
      if (filterUtil === 'optimal') return (w.utilization || 0) <= 75;
      return true;
    });
  }, [warehouses, filterUtil]);

  if (loading && warehouses.length === 0) {
    return (
      <div className="flex min-h-[460px] items-center justify-center">
        <div className="card p-8 text-center max-w-sm border-slate-100 shadow-sm">
          <div className="h-12 w-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-4 border border-blue-100">
            <RefreshCw className="h-6 w-6 animate-spin text-blue-600" />
          </div>
          <h3 className="text-base font-bold text-slate-900">Synchronizing Storage Hubs</h3>
          <p className="mt-1.5 text-xs text-slate-500">Retrieving capacity telemetry, SKU distributions, and 30-day congestion forecasts...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-7 animate-fadeIn">
      {/* 1. Header & Actions */}
      <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-center">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600">Storage & Facility Hubs</span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-100">Regional Network</span>
          </div>
          <h1 className="mt-1 text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
            Warehouse Logistics & Capacity Hub
          </h1>
          <p className="mt-1.5 max-w-2xl text-sm font-medium text-slate-500">
            Real-time storage utilization, SKU inventory valuation, and multi-facility capacity runway modeling.
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
            <span>Export Capacity Report</span>
          </button>

          <button 
            onClick={loadData} 
            disabled={loading}
            className="btn btn-primary inline-flex items-center gap-2 text-xs font-bold px-5 py-2.5 shadow-md shadow-blue-500/25"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>{loading ? 'Auditing...' : 'Audit Hubs'}</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="flex items-start justify-between gap-4 rounded-2xl border border-rose-200 bg-rose-50/80 p-4 text-sm text-rose-800 shadow-sm">
          <div className="flex items-center gap-2.5">
            <AlertTriangle className="h-4 w-4 text-rose-600 shrink-0" />
            <span>{error}</span>
          </div>
          <button className="font-semibold underline hover:text-rose-950" onClick={loadData}>Retry</button>
        </div>
      )}

      {/* 2. Top Row - 4 KPI Cards & Highlight Tiles */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Card 1: Total Network Capacity */}
        <div className="card p-5 relative overflow-hidden group hover:-translate-y-1 transition-all duration-300">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600 border border-blue-100/80">
                <Warehouse className="h-5 w-5" />
              </div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Network Storage</p>
            </div>
            <div className="p-1 text-slate-300 group-hover:text-blue-500 transition-colors">
              <ArrowUpRight className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline justify-between">
            <div>
              <div className="text-3xl font-extrabold tracking-tight text-slate-900">
                {totals.totalOccupied.toLocaleString()}
              </div>
              <p className="mt-0.5 text-xs text-slate-500 font-medium">of {totals.totalCapacity.toLocaleString()} Max Capacity</p>
            </div>
            <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-100">
              {warehouses.length} Hubs
            </span>
          </div>
        </div>

        {/* Card 2: Average Network Utilization */}
        <div className="card p-5 relative overflow-hidden group hover:-translate-y-1 transition-all duration-300">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100/80">
                <Activity className="h-5 w-5" />
              </div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Mean Utilization</p>
            </div>
            <div className="p-1 text-slate-300 group-hover:text-emerald-500 transition-colors">
              <ArrowUpRight className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline justify-between">
            <div>
              <div className="text-3xl font-extrabold tracking-tight text-slate-900">{totals.avgUtil}%</div>
              <p className="mt-0.5 text-xs text-slate-500 font-medium">SLA Target &lt; 80%</p>
            </div>
            <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
              Number(totals.avgUtil) > 85 ? 'bg-rose-50 text-rose-700' :
              Number(totals.avgUtil) > 75 ? 'bg-amber-50 text-amber-700' :
              'bg-emerald-50 text-emerald-700'
            }`}>
              {Number(totals.avgUtil) > 80 ? 'Heavy Load' : 'Balanced'}
            </span>
          </div>
        </div>

        {/* Tile 3: Total Inventory Valuation (Saturated Indigo Accent Tile) */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-500 to-indigo-600 p-5 text-white shadow-md shadow-indigo-500/15 hover:-translate-y-1 transition-all duration-300">
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/20 backdrop-blur-sm text-[11px] font-bold uppercase tracking-wider text-white">
              <DollarSign className="h-3 w-3" />
              Valuation
            </span>
            <span className="text-xs font-bold text-white/80">Active Stock</span>
          </div>
          <div className="mt-4 flex items-baseline justify-between">
            <div>
              <div className="text-3xl font-black tracking-tight text-white">
                {formatLakhs(totals.totalValue)}
              </div>
              <p className="mt-0.5 text-xs font-medium text-indigo-100">Total Asset Value</p>
            </div>
            <div className="text-right">
              <span className="text-xs font-extrabold bg-white/20 px-2 py-1 rounded-lg text-white">
                Secured
              </span>
            </div>
          </div>
        </div>

        {/* Tile 4: Congestion Watch Tile (Saturated Coral Rose Tile) */}
        <div 
          onClick={() => setFilterUtil(filterUtil === 'critical' ? 'all' : 'critical')}
          className={`relative overflow-hidden rounded-2xl bg-gradient-to-br from-rose-500 to-rose-600 p-5 text-white shadow-md shadow-rose-500/15 hover:-translate-y-1 transition-all duration-300 cursor-pointer ${filterUtil === 'critical' ? 'ring-3 ring-rose-400 ring-offset-2' : ''}`}
        >
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/20 backdrop-blur-sm text-[11px] font-bold uppercase tracking-wider text-white">
              <ShieldAlert className="h-3 w-3" />
              Congestion
            </span>
            <span className="text-xs font-bold text-white/80">&gt;85% Utilization</span>
          </div>
          <div className="mt-4 flex items-baseline justify-between">
            <div>
              <div className="text-3xl font-black tracking-tight text-white">
                {totals.criticalHubs.length}
              </div>
              <p className="mt-0.5 text-xs font-medium text-rose-100">Congested Facility</p>
            </div>
            <div className="text-right">
              <span className="text-xs font-extrabold bg-white/20 px-2.5 py-1 rounded-lg text-white">
                Action Req.
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Filter Controls */}
      <div className="card p-3 border-slate-100 flex flex-wrap items-center justify-between gap-3 shadow-sm">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 pl-2">Filter Capacity:</span>
          <div className="flex items-center gap-1.5 p-1 bg-slate-100/80 rounded-full border border-slate-200/60">
            <button
              onClick={() => setFilterUtil('all')}
              className={`px-3.5 py-1 rounded-full text-xs font-semibold transition-all ${
                filterUtil === 'all' 
                  ? 'bg-white text-slate-900 shadow-xs' 
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All Hubs ({warehouses.length})
            </button>
            <button
              onClick={() => setFilterUtil('critical')}
              className={`px-3.5 py-1 rounded-full text-xs font-semibold transition-all ${
                filterUtil === 'critical' 
                  ? 'bg-rose-500 text-white shadow-xs' 
                  : 'text-rose-600 hover:text-rose-800'
              }`}
            >
              Congested ({totals.criticalHubs.length})
            </button>
            <button
              onClick={() => setFilterUtil('high')}
              className={`px-3.5 py-1 rounded-full text-xs font-semibold transition-all ${
                filterUtil === 'high' 
                  ? 'bg-amber-500 text-white shadow-xs' 
                  : 'text-amber-700 hover:text-amber-900'
              }`}
            >
              Heavy ({totals.highHubs.length})
            </button>
            <button
              onClick={() => setFilterUtil('optimal')}
              className={`px-3.5 py-1 rounded-full text-xs font-semibold transition-all ${
                filterUtil === 'optimal' 
                  ? 'bg-emerald-600 text-white shadow-xs' 
                  : 'text-emerald-700 hover:text-emerald-900'
              }`}
            >
              Optimal (&lt;75%)
            </button>
          </div>
        </div>

        <Link 
          to="/inventory" 
          className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-800 px-3 py-1.5 transition-colors"
        >
          <span>View Multi-SKU Inventory Radar</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      {/* 4. Warehouse Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredWarehouses.map((wh) => {
          const isCritical = (wh.utilization || 0) > 85;
          const isWarning = (wh.utilization || 0) > 75 && (wh.utilization || 0) <= 85;
          const forecastData = forecasts[wh.id]?.forecast || [];
          const freeBuffer = (wh.capacity || 0) - (wh.occupied || 0);

          // Prepare trend chart data (sampled to 10 points)
          const trendData = forecastData
            .filter((_, idx) => idx % 3 === 0)
            .map(f => ({
              date: f.date,
              util: Number(f.predicted_utilization || wh.utilization)
            }));

          return (
            <div 
              key={wh.id} 
              className={`card p-6 border-slate-100 hover:shadow-card-hover transition-all duration-300 relative overflow-hidden group ${
                isCritical ? 'border-t-4 border-t-rose-500' : 
                isWarning ? 'border-t-4 border-t-amber-500' : 
                'border-t-4 border-t-emerald-500'
              }`}
            >
              {/* Header */}
              <div className="flex items-start justify-between gap-3 mb-5">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                      {wh.id}
                    </span>
                    <StatusBadge status={isCritical ? 'critical' : isWarning ? 'warning' : 'healthy'} />
                  </div>
                  <h3 className="text-xl font-extrabold text-slate-900 tracking-tight mt-1.5 group-hover:text-blue-600 transition-colors">
                    {wh.name}
                  </h3>
                  <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-1">
                    <MapPin className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                    <span>{wh.location}</span>
                  </div>
                </div>

                <div className={`p-3 rounded-2xl shrink-0 ${
                  isCritical ? 'bg-rose-50 text-rose-600 border border-rose-100' :
                  isWarning ? 'bg-amber-50 text-amber-600 border border-amber-100' :
                  'bg-blue-50 text-blue-600 border border-blue-100'
                }`}>
                  <Warehouse className="h-6 w-6" />
                </div>
              </div>

              {/* Capacity Utilization Progress Bar */}
              <div className="space-y-2 mb-5 p-4 rounded-xl bg-slate-50/70 border border-slate-100">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span className="text-slate-600">Storage Utilization</span>
                  <span className={`text-base font-extrabold ${
                    isCritical ? 'text-rose-600' : isWarning ? 'text-amber-600' : 'text-slate-900'
                  }`}>
                    {wh.utilization}%
                  </span>
                </div>

                <div className="w-full bg-slate-200/80 rounded-full h-2.5 overflow-hidden flex">
                  <div 
                    className={`h-2.5 rounded-full transition-all duration-500 ${
                      isCritical ? 'bg-rose-500' :
                      isWarning ? 'bg-amber-500' :
                      'bg-emerald-500'
                    }`}
                    style={{ width: `${Math.min(100, wh.utilization)}%` }}
                  />
                </div>

                <div className="flex justify-between text-[11px] font-medium text-slate-500 pt-0.5">
                  <span>{wh.occupied.toLocaleString()} units stored</span>
                  <span className="font-semibold text-slate-700">{freeBuffer.toLocaleString()} free capacity</span>
                </div>
              </div>

              {/* 30-Day Congestion Forecast Mini Sparkline */}
              {trendData.length > 0 && (
                <div className="mb-5 p-3 rounded-xl bg-white border border-slate-100">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                      <TrendingUp className="h-3 w-3 text-blue-500" />
                      30-Day Capacity Forecast
                    </span>
                    <span className="text-[11px] font-semibold text-slate-600">
                      {isCritical ? 'High Runway Alert' : 'Stable Trajectory'}
                    </span>
                  </div>
                  <div className="h-14 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={trendData}>
                        <defs>
                          <linearGradient id={`grad-${wh.id}`} x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor={isCritical ? '#F43F5E' : '#3B82F6'} stopOpacity={0.3}/>
                            <stop offset="100%" stopColor={isCritical ? '#F43F5E' : '#3B82F6'} stopOpacity={0.0}/>
                          </linearGradient>
                        </defs>
                        <Area 
                          type="monotone" 
                          dataKey="util" 
                          stroke={isCritical ? '#F43F5E' : '#2563EB'} 
                          strokeWidth={2} 
                          fill={`url(#grad-${wh.id})`} 
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              )}

              {/* Stats Grid */}
              <div className="grid grid-cols-3 gap-3 pt-4 border-t border-slate-100">
                <div className="rounded-xl bg-slate-50/80 p-2.5 text-center">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">SKU Count</p>
                  <p className="text-base font-extrabold text-slate-900 mt-0.5">{wh.sku_count || 0}</p>
                </div>
                <div className="rounded-xl bg-slate-50/80 p-2.5 text-center">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Stored Value</p>
                  <p className="text-base font-extrabold text-slate-900 mt-0.5">{formatLakhs(wh.inventory_value)}</p>
                </div>
                <div className="rounded-xl bg-slate-50/80 p-2.5 text-center">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Max Limit</p>
                  <p className="text-base font-extrabold text-slate-900 mt-0.5">{(wh.capacity / 1000).toFixed(0)}k <span className="text-[10px] font-normal text-slate-400">u</span></p>
                </div>
              </div>

              {/* Bottom Card Action */}
              <div className="mt-4 pt-3 flex items-center justify-between">
                <Link 
                  to="/inventory" 
                  className="text-xs font-bold text-blue-600 hover:text-blue-800 inline-flex items-center gap-1 group-hover:translate-x-0.5 transition-transform"
                >
                  <span>Explore SKUs at this hub</span>
                  <ArrowRight className="h-3 w-3" />
                </Link>
                <span className="text-[11px] font-mono text-slate-400">
                  {wh.lat.toFixed(2)}°N, {wh.lng.toFixed(2)}°E
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

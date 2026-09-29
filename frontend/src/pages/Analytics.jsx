import { useState, useEffect, useMemo } from 'react';
import { 
  TrendingUp, AlertTriangle, AlertCircle, Clock, Package, DollarSign, 
  Warehouse, Sliders, RefreshCw, Search, ArrowUpRight, CheckCircle, 
  Sparkles, Layers, ShieldAlert, BarChart3, Calendar, ChevronRight, Zap
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, ReferenceLine, LineChart, Line, BarChart, Bar, Legend
} from 'recharts';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import KPICard from '../components/KPICard';
import StatusBadge from '../components/StatusBadge';

const formatCurrency = (val) => `₹${Number(val || 0).toLocaleString('en-IN')}`;
const formatLakhs = (val) => `₹${(Number(val || 0) / 100000).toFixed(1)}L`;

export default function Analytics() {
  // Navigation sub-tabs
  const [activeTab, setActiveTab] = useState('demand'); // 'demand', 'delay', 'cost', 'warehouse'
  const [daysHorizon, setDaysHorizon] = useState(30);

  // Data states
  const [demandForecasts, setDemandForecasts] = useState([]);
  const [selectedSkuIndex, setSelectedSkuIndex] = useState(0);
  const [delayPredictions, setDelayPredictions] = useState([]);
  const [costForecast, setCostForecast] = useState(null);
  const [warehouseForecasts, setWarehouseForecasts] = useState([]);
  
  // Interactive Controls
  const [demandSurgePct, setDemandSurgePct] = useState(0);
  const [delaySearch, setDelaySearch] = useState('');
  const [delayRiskFilter, setDelayRiskFilter] = useState('all'); // 'all', 'high', 'medium', 'low'

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');

  const loadAllAnalytics = async (days = daysHorizon) => {
    setError('');
    try {
      const [demand, delays, cost, warehouse] = await Promise.all([
        api.getDemandForecast({ days }),
        api.getDelayPredictions(),
        api.getCostForecast({ days }),
        api.getWarehouseCapacityForecast()
      ]);
      setDemandForecasts(demand || []);
      setDelayPredictions(delays || []);
      setCostForecast(cost || null);
      setWarehouseForecasts(warehouse || []);
    } catch (err) {
      console.error('Analytics load error:', err);
      setError(err.message || 'Failed to retrieve predictive analytics telemetry.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadAllAnalytics(daysHorizon);
  }, [daysHorizon]);

  const handleRefresh = () => {
    setRefreshing(true);
    loadAllAnalytics(daysHorizon);
  };

  // Currently selected product forecast with simulated surge applied
  const selectedProduct = demandForecasts[selectedSkuIndex] || demandForecasts[0] || null;

  const chartDataWithSurge = useMemo(() => {
    if (!selectedProduct?.forecast) return [];
    const surgeMultiplier = 1 + (demandSurgePct / 100);
    return selectedProduct.forecast.map(point => {
      const predicted = Math.round(point.predicted * surgeMultiplier);
      const upper = Math.round(point.upper_bound * surgeMultiplier);
      const lower = Math.round(point.lower_bound * surgeMultiplier);
      return {
        ...point,
        predicted,
        upper_bound: upper,
        lower_bound: lower,
        historical_baseline: selectedProduct.historical_avg
      };
    });
  }, [selectedProduct, demandSurgePct]);

  // Filtered delay predictions
  const filteredDelays = useMemo(() => {
    return delayPredictions.filter(pred => {
      const matchesSearch = 
        pred.shipment_id?.toLowerCase().includes(delaySearch.toLowerCase()) ||
        pred.destination?.toLowerCase().includes(delaySearch.toLowerCase());
      
      const matchesRisk = 
        delayRiskFilter === 'all' || 
        pred.risk_level === delayRiskFilter;

      return matchesSearch && matchesRisk;
    });
  }, [delayPredictions, delaySearch, delayRiskFilter]);

  // Aggregate high delay count
  const criticalDelayCount = useMemo(() => {
    return delayPredictions.filter(d => d.risk_level === 'high').length;
  }, [delayPredictions]);

  if (loading && !demandForecasts.length) {
    return (
      <div className="flex min-h-[460px] items-center justify-center">
        <div className="card p-8 text-center max-w-sm border-slate-100 shadow-sm">
          <div className="h-12 w-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-4 border border-blue-100">
            <RefreshCw className="h-6 w-6 animate-spin text-blue-600" />
          </div>
          <h3 className="text-base font-bold text-slate-900">Computing Predictive Models</h3>
          <p className="mt-1.5 text-xs text-slate-500">Processing ARIMA-hybrid forecasts, transit risk correlations, and capacity models...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-7 animate-fadeIn">
      {/* Header Bar */}
      <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-center">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600">Forecasting Engine</span>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-100 flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-blue-600 animate-pulse"></span>
              92.4% Model Confidence
            </span>
          </div>
          <h1 className="mt-1 text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
            Predictive Analytics Center
          </h1>
          <p className="mt-1.5 max-w-2xl text-sm font-medium text-slate-500">
            Multi-horizon operational intelligence forecasting future SKU demand, transit bottleneck probabilities, and warehouse saturation.
          </p>
        </div>

        {/* Global Toolbar */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Horizon Selector */}
          <div className="inline-flex p-1 rounded-full bg-white border border-slate-200 shadow-sm text-xs font-semibold text-slate-600">
            {[7, 14, 30, 60].map(days => (
              <button
                key={days}
                onClick={() => setDaysHorizon(days)}
                className={`px-3 py-1.5 rounded-full transition-all ${
                  daysHorizon === days 
                    ? 'bg-blue-600 text-white shadow-sm' 
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {days}D Horizon
              </button>
            ))}
          </div>

          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="btn btn-primary inline-flex items-center gap-2 text-xs font-bold px-4 py-2"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${refreshing ? 'animate-spin' : ''}`} />
            <span>{refreshing ? 'Recomputing...' : 'Re-Run Models'}</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-3 rounded-2xl border border-rose-200 bg-rose-50/80 p-4 text-sm text-rose-800">
          <AlertCircle className="h-5 w-5 text-rose-600 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Top 4 Predictive Scorecard Tiles */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <KPICard
          title="Demand Trajectory"
          value={selectedProduct ? `${selectedProduct.historical_avg} u/day` : '—'}
          subtitle={selectedProduct ? `${selectedProduct.sku} • 30-Day Mean` : 'Demand Baseline'}
          icon={TrendingUp}
          color="primary"
          trend={{ direction: 'up', value: `+${demandSurgePct}%`, label: 'surge simulated' }}
        />

        <KPICard
          title="At-Risk Shipments"
          value={criticalDelayCount.toString()}
          subtitle="Delay probability > 70%"
          icon={AlertTriangle}
          color={criticalDelayCount > 0 ? 'danger' : 'success'}
          badge={criticalDelayCount > 0 ? 'Immediate Action' : 'Stable'}
        />

        <KPICard
          title="Projected Spend"
          value={costForecast ? formatLakhs(costForecast.total_forecast) : '₹18.4L'}
          subtitle={`${daysHorizon}-Day Logistics Budget`}
          icon={DollarSign}
          color="warning"
          trend={{ direction: 'up', value: '4.8%', label: 'vs last month' }}
        />

        <KPICard
          title="Capacity Bottlenecks"
          value={warehouseForecasts.filter(w => w.risk_level === 'high').length.toString()}
          subtitle="Warehouses > 85% full"
          icon={Warehouse}
          color="purple"
          badge="WH-03 Alert"
        />
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="border-b border-slate-200/80">
        <div className="flex flex-wrap gap-2 sm:gap-6">
          {[
            { id: 'demand', label: 'SKU Demand Forecasting', icon: Package, badge: `${demandForecasts.length} SKUs` },
            { id: 'delay', label: 'Transit Delay Probability', icon: Clock, badge: `${delayPredictions.length} Active` },
            { id: 'cost', label: 'Logistics Cost Trajectory', icon: DollarSign, badge: 'Budget' },
            { id: 'warehouse', label: 'Warehouse Capacity Horizon', icon: Warehouse, badge: '4 Hubs' }
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`group flex items-center gap-2.5 pb-3.5 pt-1 text-sm font-bold border-b-2 transition-all ${
                  isActive
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300'
                }`}
              >
                <Icon className={`h-4 w-4 ${isActive ? 'text-blue-600' : 'text-slate-400 group-hover:text-slate-600'}`} />
                <span>{tab.label}</span>
                {tab.badge && (
                  <span className={`text-[11px] px-2 py-0.5 rounded-full font-semibold ${
                    isActive ? 'bg-blue-100 text-blue-800' : 'bg-slate-100 text-slate-600'
                  }`}>
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* TAB 1: DEMAND FORECASTING */}
      {activeTab === 'demand' && selectedProduct && (
        <div className="space-y-6">
          {/* Controls Bar: SKU Picker + Surge Simulator */}
          <div className="card p-5">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              {/* Product selector buttons */}
              <div className="flex-1">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Select Inventory SKU for Deep Analysis</p>
                <div className="flex flex-wrap gap-2">
                  {demandForecasts.map((prod, idx) => (
                    <button
                      key={prod.product_id}
                      onClick={() => setSelectedSkuIndex(idx)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                        selectedSkuIndex === idx
                          ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/20'
                          : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200/60'
                      }`}
                    >
                      {prod.sku} <span className="opacity-75 font-normal">({prod.name.split(' ')[0]})</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Demand Surge Slider */}
              <div className="lg:w-72 bg-blue-50/60 border border-blue-100 p-4 rounded-2xl">
                <div className="flex items-center justify-between text-xs font-bold text-slate-700 mb-1.5">
                  <span className="flex items-center gap-1.5 text-blue-900">
                    <Sliders className="h-3.5 w-3.5 text-blue-600" />
                    Simulate Surge:
                  </span>
                  <span className="font-extrabold text-blue-700">+{demandSurgePct}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="50"
                  step="5"
                  value={demandSurgePct}
                  onChange={(e) => setDemandSurgePct(Number(e.target.value))}
                  className="w-full accent-blue-600 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400 font-medium mt-1">
                  <span>Baseline (0%)</span>
                  <span>Festive (+25%)</span>
                  <span>Peak (+50%)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Forecast Area Chart Card */}
          <div className="card p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-extrabold text-slate-900">{selectedProduct.name}</h3>
                  <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-slate-100 text-slate-700 border border-slate-200">
                    {selectedProduct.sku}
                  </span>
                </div>
                <p className="mt-1 text-xs text-slate-500 font-medium">
                  {daysHorizon}-Day predictive trajectory with ±15% statistical confidence bounds and baseline comparison.
                </p>
              </div>

              {/* Chart Legend Chips */}
              <div className="flex flex-wrap items-center gap-4 text-xs font-semibold">
                <div className="flex items-center gap-1.5">
                  <span className="h-3 w-3 rounded-sm bg-blue-100 border border-blue-300"></span>
                  <span className="text-slate-600">Confidence Band (Upper/Lower)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="h-2 w-4 rounded-full bg-blue-600"></span>
                  <span className="text-slate-900 font-bold">Predicted Demand</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="h-0.5 w-4 border-t-2 border-dashed border-slate-400"></span>
                  <span className="text-slate-500">Historical Avg</span>
                </div>
              </div>
            </div>

            <div className="h-[340px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartDataWithSurge} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="predictedGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2563EB" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#2563EB" stopOpacity={0.0} />
                    </linearGradient>
                    <linearGradient id="bandGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#93C5FD" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#93C5FD" stopOpacity={0.05} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                  <XAxis 
                    dataKey="date" 
                    tick={{ fontSize: 11, fill: '#94A3B8' }} 
                    axisLine={{ stroke: '#E2E8F0' }} 
                    tickLine={false} 
                  />
                  <YAxis 
                    tick={{ fontSize: 11, fill: '#94A3B8' }} 
                    axisLine={false} 
                    tickLine={false} 
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#FFFFFF', 
                      borderRadius: '1rem', 
                      boxShadow: '0 10px 25px -5px rgba(15, 23, 42, 0.08)',
                      border: '1px solid #F1F5F9',
                      fontSize: '12px',
                      padding: '12px'
                    }}
                    formatter={(val, name) => [
                      `${val} units`, 
                      name === 'predicted' ? 'Predicted Demand' :
                      name === 'upper_bound' ? 'Max Bound' :
                      name === 'lower_bound' ? 'Min Bound' : name
                    ]}
                  />
                  <ReferenceLine 
                    y={selectedProduct.historical_avg} 
                    stroke="#94A3B8" 
                    strokeDasharray="4 4" 
                    label={{ value: `Avg (${selectedProduct.historical_avg})`, position: 'right', fill: '#94A3B8', fontSize: 10 }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="upper_bound" 
                    stroke="#93C5FD" 
                    strokeWidth={1}
                    fillOpacity={1} 
                    fill="url(#bandGrad)" 
                  />
                  <Area 
                    type="monotone" 
                    dataKey="predicted" 
                    stroke="#2563EB" 
                    strokeWidth={2.5} 
                    fillOpacity={1} 
                    fill="url(#predictedGrad)" 
                  />
                  <Area 
                    type="monotone" 
                    dataKey="lower_bound" 
                    stroke="#93C5FD" 
                    strokeWidth={1}
                    fillOpacity={0} 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Micro Breakdown Metrics below chart */}
            <div className="mt-6 pt-6 border-t border-slate-100 grid grid-cols-2 gap-4 sm:grid-cols-4">
              <div className="bg-slate-50/70 p-3.5 rounded-xl border border-slate-100">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">Historical Avg</p>
                <p className="text-xl font-extrabold text-slate-900 mt-1">{selectedProduct.historical_avg} <span className="text-xs font-normal text-slate-500">units/day</span></p>
              </div>

              <div className="bg-slate-50/70 p-3.5 rounded-xl border border-slate-100">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">Total {daysHorizon}D Demand</p>
                <p className="text-xl font-extrabold text-blue-600 mt-1">
                  {chartDataWithSurge.reduce((sum, p) => sum + p.predicted, 0).toLocaleString()} <span className="text-xs font-normal text-slate-500">units</span>
                </p>
              </div>

              <div className="bg-slate-50/70 p-3.5 rounded-xl border border-slate-100">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">Peak Daily Demand</p>
                <p className="text-xl font-extrabold text-amber-600 mt-1">
                  {Math.max(...chartDataWithSurge.map(p => p.predicted))} <span className="text-xs font-normal text-slate-500">units</span>
                </p>
              </div>

              <div className="bg-slate-50/70 p-3.5 rounded-xl border border-slate-100">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">Model Accuracy</p>
                <p className="text-xl font-extrabold text-emerald-600 mt-1">{selectedProduct.accuracy || 92.4}%</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: TRANSIT DELAY PREDICTION */}
      {activeTab === 'delay' && (
        <div className="space-y-6">
          {/* Filter and Search Bar */}
          <div className="card p-5">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="relative w-full sm:w-80">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search shipment ID or destination..."
                  value={delaySearch}
                  onChange={(e) => setDelaySearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-full border border-slate-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                />
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <span className="text-xs font-semibold text-slate-500">Filter Risk:</span>
                <div className="inline-flex p-1 rounded-full bg-slate-100 text-xs font-semibold">
                  {['all', 'high', 'medium', 'low'].map(risk => (
                    <button
                      key={risk}
                      onClick={() => setDelayRiskFilter(risk)}
                      className={`px-3 py-1 rounded-full capitalize transition-all ${
                        delayRiskFilter === risk 
                          ? 'bg-white text-slate-900 shadow-sm font-bold' 
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      {risk}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Delay Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {filteredDelays.map(pred => {
              const isHigh = pred.delay_probability > 70;
              const isMedium = pred.delay_probability > 40 && pred.delay_probability <= 70;
              const barColor = isHigh ? 'bg-rose-500' : isMedium ? 'bg-amber-500' : 'bg-emerald-500';
              const badgeClass = isHigh ? 'bg-rose-50 text-rose-700 border-rose-200' : isMedium ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-emerald-50 text-emerald-700 border-emerald-200';

              return (
                <div key={pred.shipment_id} className="card p-6 border-l-4 border-l-transparent hover:border-l-blue-600 transition-all">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2.5">
                        <span className="text-base font-extrabold text-slate-900">{pred.shipment_id}</span>
                        <StatusBadge status={pred.current_status} />
                      </div>
                      <p className="mt-1 text-xs text-slate-500 font-medium">Destination: <span className="font-bold text-slate-700">{pred.destination}</span></p>
                    </div>

                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${badgeClass} uppercase tracking-wider`}>
                      {pred.risk_level} Risk
                    </span>
                  </div>

                  {/* Delay Progress Gauge */}
                  <div className="mt-5 bg-slate-50 p-4 rounded-xl border border-slate-100">
                    <div className="flex items-center justify-between text-xs font-bold mb-1.5">
                      <span className="text-slate-600">Delay Probability</span>
                      <span className={`text-base font-black ${isHigh ? 'text-rose-600' : isMedium ? 'text-amber-600' : 'text-emerald-600'}`}>
                        {pred.delay_probability}%
                      </span>
                    </div>
                    <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${barColor} transition-all duration-500`}
                        style={{ width: `${Math.min(100, pred.delay_probability)}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Delay Contributing Factors breakdown */}
                  <div className="mt-4 space-y-2">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Root-Cause Delay Weights</p>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="p-2 bg-slate-50 rounded-lg flex items-center justify-between">
                        <span className="text-slate-600">Route Congestion</span>
                        <span className="font-bold text-slate-900">{isHigh ? '42%' : '20%'}</span>
                      </div>
                      <div className="p-2 bg-slate-50 rounded-lg flex items-center justify-between">
                        <span className="text-slate-600">Vehicle Capacity</span>
                        <span className="font-bold text-slate-900">{isHigh ? '28%' : '15%'}</span>
                      </div>
                      <div className="p-2 bg-slate-50 rounded-lg flex items-center justify-between">
                        <span className="text-slate-600">Delivery Window</span>
                        <span className="font-bold text-slate-900">{isHigh ? '18%' : '10%'}</span>
                      </div>
                      <div className="p-2 bg-slate-50 rounded-lg flex items-center justify-between">
                        <span className="text-slate-600">Historical Risk</span>
                        <span className="font-bold text-slate-900">12%</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
                    <div className="text-xs">
                      <span className="text-slate-400">Target ETA:</span>{' '}
                      <span className="font-semibold text-slate-700">{pred.eta ? new Date(pred.eta).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'Pending'}</span>
                    </div>

                    <Link
                      to="/optimization"
                      className="btn btn-primary text-xs font-bold inline-flex items-center gap-1.5 py-1.5 px-3"
                    >
                      <Zap className="h-3.5 w-3.5" />
                      <span>Reroute in AI Solver</span>
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 3: LOGISTICS COST FORECAST */}
      {activeTab === 'cost' && costForecast && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="card p-5">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Historical Daily Average</p>
              <p className="mt-2 text-3xl font-extrabold text-slate-900">
                {formatCurrency(costForecast.historical_avg_daily)}
              </p>
              <p className="mt-1 text-xs text-slate-500 font-medium">Derived from 90-day fulfilled dispatches</p>
            </div>

            <div className="card p-5 border-l-4 border-l-blue-600">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-500">{daysHorizon}-Day Projected Expenditure</p>
              <p className="mt-2 text-3xl font-extrabold text-blue-600">
                {formatCurrency(costForecast.total_forecast)}
              </p>
              <p className="mt-1 text-xs text-blue-800 font-medium">Estimated fuel, toll & operating expenses</p>
            </div>

            <div className="card p-5 border-l-4 border-l-emerald-600">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-500">AI Optimization Savings Potential</p>
              <p className="mt-2 text-3xl font-extrabold text-emerald-600">₹3,20,000</p>
              <p className="mt-1 text-xs text-emerald-800 font-medium">Estimated savings via route & fleet allocation</p>
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-extrabold text-slate-900">Projected Daily Logistics Cost ({daysHorizon} Days)</h3>
                <p className="text-xs text-slate-500 mt-1">Simulated variance with ±10% upper and lower operational boundaries</p>
              </div>
            </div>

            <div className="h-[320px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={costForecast.forecast} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                  <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={{ stroke: '#E2E8F0' }} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} tickFormatter={(v) => `₹${v/1000}k`} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#FFF', borderRadius: '1rem', border: '1px solid #F1F5F9' }}
                    formatter={(val) => [formatCurrency(val), 'Cost']}
                  />
                  <ReferenceLine y={costForecast.historical_avg_daily} stroke="#94A3B8" strokeDasharray="3 3" label={{ value: 'Avg', fill: '#94A3B8', fontSize: 10 }} />
                  <Area type="monotone" dataKey="upper_bound" stroke="#CBD5E1" fill="#F1F5F9" fillOpacity={0.6} />
                  <Area type="monotone" dataKey="predicted_cost" stroke="#2563EB" strokeWidth={2.5} fill="#DBEAFE" fillOpacity={0.4} />
                  <Area type="monotone" dataKey="lower_bound" stroke="#CBD5E1" fill="#FFF" fillOpacity={1} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: WAREHOUSE CAPACITY HORIZON */}
      {activeTab === 'warehouse' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {warehouseForecasts.map(wh => {
              const currentUtil = wh.current_utilization || 0;
              const isHighRisk = wh.risk_level === 'high' || currentUtil > 85;
              const isMedRisk = wh.risk_level === 'medium' || (currentUtil > 70 && currentUtil <= 85);
              const statusColor = isHighRisk ? 'text-rose-600' : isMedRisk ? 'text-amber-600' : 'text-emerald-600';
              const barColor = isHighRisk ? 'bg-rose-500' : isMedRisk ? 'bg-amber-500' : 'bg-emerald-500';

              return (
                <div key={wh.warehouse_id} className="card p-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="text-base font-extrabold text-slate-900">{wh.warehouse_name}</h4>
                      <p className="text-xs text-slate-500 mt-0.5">ID: {wh.warehouse_id}</p>
                    </div>

                    <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                      isHighRisk ? 'bg-rose-50 text-rose-700 border border-rose-200' :
                      isMedRisk ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                      'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    }`}>
                      {wh.risk_level === 'high' ? 'Near Capacity' : wh.risk_level === 'medium' ? 'Optimal' : 'Healthy'}
                    </span>
                  </div>

                  <div className="mt-4 flex items-end justify-between">
                    <div>
                      <p className="text-xs text-slate-500 font-medium">Current Utilization</p>
                      <p className={`text-3xl font-extrabold ${statusColor} mt-1`}>{currentUtil}%</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-slate-500 font-medium">30D Forecast</p>
                      <p className="text-lg font-bold text-slate-800 mt-1">
                        {wh.forecast ? wh.forecast[wh.forecast.length - 1].predicted_utilization : currentUtil}%
                      </p>
                    </div>
                  </div>

                  <div className="mt-3 w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className={`h-full ${barColor}`} style={{ width: `${Math.min(100, currentUtil)}%` }}></div>
                  </div>

                  {/* Mini Forecast Curve */}
                  <div className="mt-4 h-24 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={wh.forecast || []} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="2 2" vertical={false} stroke="#F8FAFC" />
                        <YAxis domain={[0, 100]} tick={{ fontSize: 9, fill: '#CBD5E1' }} />
                        <Tooltip 
                          formatter={(v) => [`${v}%`, 'Capacity']}
                          contentStyle={{ fontSize: '11px', borderRadius: '0.5rem' }} 
                        />
                        <ReferenceLine y={90} stroke="#F43F5E" strokeDasharray="3 3" />
                        <Line type="monotone" dataKey="predicted_utilization" stroke={isHighRisk ? '#F43F5E' : '#2563EB'} strokeWidth={2} dot={false} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>

                  {isHighRisk && (
                    <div className="mt-4 p-3 rounded-xl bg-rose-50 border border-rose-200/80 flex items-center justify-between text-xs text-rose-800">
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4 text-rose-600 shrink-0" />
                        <span>Projected to reach saturation in &lt;10 days.</span>
                      </div>
                      <Link to="/warehouses" className="font-bold underline hover:text-rose-950">
                        Transfer Stock
                      </Link>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

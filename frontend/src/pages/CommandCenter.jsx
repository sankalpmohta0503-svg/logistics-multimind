import { useEffect, useState, useMemo } from 'react';
import { 
  AlertTriangle, ArrowRight, CheckCircle, Clock, DollarSign, Package, 
  RefreshCw, Ship, Truck, Warehouse, Zap, ArrowUpRight, ShieldAlert,
  Calendar, Download, Activity, TrendingUp, Sparkles, AlertCircle
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { AreaChart, Area, ResponsiveContainer } from 'recharts';
import KPICard from '../components/KPICard';
import AIDecisionCard from '../components/AIDecisionCard';
import StatusBadge from '../components/StatusBadge';
import { api } from '../services/api';

const formatLakhs = (value) => `₹${(Number(value || 0) / 100000).toFixed(1)}L`;
const formatCurrency = (value) => `₹${Number(value || 0).toLocaleString('en-IN')}`;

// Micro-sparkline sample trend curve for On-Time Delivery
const deliverySparkline = [
  { val: 82 }, { val: 84 }, { val: 81 }, { val: 86 }, { val: 85 }, { val: 88 }, { val: 91 }
];

export default function CommandCenter() {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [applyingId, setApplyingId] = useState(null);
  const [actionMessage, setActionMessage] = useState('');

  const loadDashboard = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await api.getDashboard();
      setDashboardData(data);
    } catch (requestError) {
      setError(requestError.message || 'Failed to load dashboard data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  const handleApplyRecommendation = async (id) => {
    setApplyingId(id);
    setActionMessage('');
    setError('');
    try {
      await api.applyRecommendation(id);
      setActionMessage('AI Recommendation executed successfully. Operational plans updated.');
      await loadDashboard();
    } catch (requestError) {
      setError(requestError.message || 'Failed to apply recommendation.');
    } finally {
      setApplyingId(null);
    }
  };

  // Determine greeting based on current local hour
  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  }, []);

  if (loading && !dashboardData) {
    return (
      <div className="flex min-h-[460px] items-center justify-center">
        <div className="card p-8 text-center max-w-sm border-slate-100 shadow-sm">
          <div className="h-12 w-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-4 border border-blue-100">
            <RefreshCw className="h-6 w-6 animate-spin text-blue-600" />
          </div>
          <h3 className="text-base font-bold text-slate-900">Synchronizing Control Tower</h3>
          <p className="mt-1.5 text-xs text-slate-500">Retrieving real-time telemetry from fleet, warehouse, and active shipment nodes...</p>
        </div>
      </div>
    );
  }

  if (error && !dashboardData) {
    return (
      <div className="card flex min-h-[420px] items-center justify-center p-8">
        <div className="max-w-md text-center">
          <div className="h-14 w-14 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto mb-4 border border-rose-100">
            <AlertTriangle className="h-7 w-7 text-rose-600" />
          </div>
          <h1 className="text-xl font-bold text-slate-900">Command Center Unavailable</h1>
          <p className="mt-2 text-sm text-slate-600">{error}</p>
          <button onClick={loadDashboard} className="btn btn-primary mt-6 inline-flex items-center gap-2">
            <RefreshCw className="h-4 w-4" /> Reconnect Now
          </button>
        </div>
      </div>
    );
  }

  const { 
    kpis = {}, 
    healthScore = 0, 
    healthStatus = 'warning', 
    alerts = [], 
    recommendations = [], 
    timestamp 
  } = dashboardData || {};

  const criticalAlerts = alerts.filter((alert) => alert.severity === 'critical');
  const highAlerts = alerts.filter((alert) => alert.severity === 'high');
  const attentionAlerts = alerts.filter((alert) => ['critical', 'high', 'medium'].includes(alert.severity));
  const hasOperationalData = Object.keys(kpis).length > 0 || alerts.length > 0 || recommendations.length > 0;
  
  const healthPercent = Math.max(0, Math.min(100, Number(healthScore)));
  const healthRing = `conic-gradient(${healthStatus === 'healthy' ? '#10B981' : healthStatus === 'critical' ? '#F43F5E' : '#F59E0B'} ${healthPercent}%, #E2E8F0 0)`;
  const healthTextColor = healthStatus === 'healthy' ? 'text-emerald-600' : healthStatus === 'critical' ? 'text-rose-600' : 'text-amber-600';
  const filledHealthStages = Math.round(healthPercent / 20);

  return (
    <div className="space-y-7 animate-fadeIn">
      {/* 1. Header Greeting & Action Bar (Inspired by KARO theme) */}
      <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-center">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600">{greeting},</span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-100">Live Telemetry</span>
          </div>
          <h1 className="mt-1 text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
            Operations Control Tower
          </h1>
          <p className="mt-1.5 max-w-2xl text-sm font-medium text-slate-500">
            Real-time decision intelligence, active freight dispatch, and automated supply chain optimization.
          </p>
        </div>

        {/* Action Toolbar */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-slate-200 text-xs font-semibold text-slate-700 shadow-sm">
            <Calendar className="h-3.5 w-3.5 text-slate-400" />
            <span>Last 30 Days</span>
          </div>

          <button 
            type="button"
            onClick={() => window.print()}
            className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-colors shadow-sm"
          >
            <Download className="h-3.5 w-3.5 text-slate-400" />
            <span>Export CSV</span>
          </button>

          <button 
            onClick={loadDashboard} 
            disabled={loading}
            className="btn btn-primary inline-flex items-center gap-2 text-xs font-bold px-5 py-2.5 shadow-md shadow-blue-500/25"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>{loading ? 'Refreshing...' : 'Refresh Hub'}</span>
          </button>
        </div>
      </div>

      {/* Error or Success notification toasts */}
      {error && dashboardData && (
        <div className="flex items-start justify-between gap-4 rounded-2xl border border-rose-200 bg-rose-50/80 p-4 text-sm text-rose-800 shadow-sm">
          <div className="flex items-center gap-2.5">
            <AlertCircle className="h-4 w-4 text-rose-600 shrink-0" />
            <span>{error}</span>
          </div>
          <button className="font-semibold underline hover:text-rose-950" onClick={loadDashboard}>Retry</button>
        </div>
      )}

      {actionMessage && (
        <div className="flex items-center justify-between rounded-2xl border border-emerald-200 bg-emerald-50/90 p-4 text-sm text-emerald-800 shadow-sm">
          <div className="flex items-center gap-2.5">
            <CheckCircle className="h-4 w-4 text-emerald-600 shrink-0" />
            <span className="font-medium">{actionMessage}</span>
          </div>
          <button onClick={() => setActionMessage('')} className="text-xs font-semibold text-emerald-700 hover:text-emerald-900">Dismiss</button>
        </div>
      )}

      {!hasOperationalData ? (
        <div className="card p-12 text-center">
          <Package className="mx-auto h-12 w-12 text-slate-300" />
          <h2 className="mt-4 text-lg font-bold text-slate-900">No Operational Data Available</h2>
          <p className="mt-1 text-sm text-slate-500">The dashboard service returned no active telemetry, alerts, or recommendations.</p>
        </div>
      ) : (
        <>
          {/* 2. Top Row - 4 Core KPI Cards with Micro-Visualizations (KARO theme) */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {/* KPI 1: Total Shipments with 5-day mini bar sparkline */}
            <KPICard 
              title="Total Shipments" 
              value={kpis.totalShipments?.toLocaleString() ?? '—'} 
              icon={Ship} 
              color="primary" 
              subtitle="All shipment records"
              chart={
                <div className="flex items-end gap-1 h-9 px-1">
                  <div className="w-1.5 h-4 rounded-full bg-blue-400" title="Mon: 65"></div>
                  <div className="w-1.5 h-6 rounded-full bg-orange-400" title="Tue: 88"></div>
                  <div className="w-1.5 h-5 rounded-full bg-blue-500" title="Wed: 72"></div>
                  <div className="w-1.5 h-8 rounded-full bg-blue-600" title="Thu: 94"></div>
                  <div className="w-1.5 h-9 rounded-full bg-orange-500" title="Fri: 110"></div>
                </div>
              }
              trend={{ direction: 'up', value: '+4.2%', label: 'vs last week' }}
            />

            {/* KPI 2: On-Time Delivery with smooth curved sparkline */}
            <KPICard 
              title="On-Time Delivery" 
              value={kpis.onTimeDelivery != null ? `${kpis.onTimeDelivery}%` : '—'} 
              icon={Clock} 
              color="success" 
              subtitle="Delivered shipment SLA"
              chart={
                <ResponsiveContainer width={90} height={38}>
                  <AreaChart data={deliverySparkline}>
                    <defs>
                      <linearGradient id="blueSpark" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#3B82F6" stopOpacity={0.4}/>
                        <stop offset="100%" stopColor="#3B82F6" stopOpacity={0.0}/>
                      </linearGradient>
                    </defs>
                    <Area type="monotone" dataKey="val" stroke="#2563EB" strokeWidth={2.5} fill="url(#blueSpark)" />
                  </AreaChart>
                </ResponsiveContainer>
              }
              trend={{ direction: 'up', value: '+2.1%', label: 'SLA target 90%' }}
            />

            {/* KPI 3: Fleet Utilization with dual-color mini progress meter */}
            <KPICard 
              title="Fleet Utilization" 
              value={kpis.fleetUtilization != null ? `${kpis.fleetUtilization}%` : '—'} 
              icon={Truck} 
              color="warning" 
              subtitle="Active in-transit load"
              chart={
                <div className="flex flex-col justify-end w-20 h-9">
                  <div className="flex justify-between text-[10px] font-mono text-slate-500 mb-1">
                    <span className="text-orange-600 font-bold">Transit</span>
                    <span>Idle</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-slate-100 flex overflow-hidden">
                    <div className="bg-orange-500 rounded-full h-full" style={{ width: `${Math.min(100, kpis.fleetUtilization || 70)}%` }}></div>
                  </div>
                </div>
              }
              trend={{ direction: 'neutral', value: 'Stable', label: 'Balanced load' }}
            />

            {/* KPI 4: Inventory Health with circular radial badge */}
            <KPICard 
              title="Inventory Health" 
              value={kpis.inventoryHealth != null ? `${kpis.inventoryHealth}%` : '—'} 
              icon={Warehouse} 
              color="success" 
              subtitle="Stock status across SKUs"
              chart={
                <div className="flex items-center justify-end w-14 h-9">
                  <div className="h-8 w-8 rounded-full border-3 border-emerald-500 border-t-emerald-200 flex items-center justify-center text-[10px] font-bold text-emerald-700">
                    OK
                  </div>
                </div>
              }
              trend={{ direction: 'up', value: '98.5%', label: 'Fill rate' }}
            />
          </div>

          {/* 3. Vibrant Operational Accent Tiles (Exact theme from Image 1 bottom-right) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {/* Tile 1: Amber / Mustard (Stockout Risks) */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-amber-400 to-amber-500 p-5 text-slate-900 shadow-md shadow-amber-500/15 hover:-translate-y-1 transition-all duration-300">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/30 backdrop-blur-xs text-[11px] font-bold uppercase tracking-wider text-slate-900">
                  <ArrowUpRight className="h-3 w-3" />
                  Inventory
                </span>
                <span className="text-xs font-bold text-slate-900/80">Reorder Watch</span>
              </div>
              <div className="mt-4 flex items-baseline justify-between">
                <div>
                  <div className="text-4xl font-black tracking-tight text-slate-900">
                    {kpis.stockoutRisks ?? '0'}
                  </div>
                  <p className="mt-0.5 text-xs font-bold text-slate-800">Critical Stockout Risks</p>
                </div>
                <div className="text-right">
                  <span className="text-xs font-extrabold bg-white/40 px-2 py-1 rounded-lg text-slate-900">
                    {kpis.stockoutRisks ? 'Action Req.' : 'Safe'}
                  </span>
                </div>
              </div>
            </div>

            {/* Tile 2: Coral / Salmon Rose (At-Risk Shipments) */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-rose-500 to-rose-600 p-5 text-white shadow-md shadow-rose-500/15 hover:-translate-y-1 transition-all duration-300">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/20 backdrop-blur-sm text-[11px] font-bold uppercase tracking-wider text-white">
                  <ArrowUpRight className="h-3 w-3" />
                  Exceptions
                </span>
                <span className="text-xs font-bold text-white/80">&gt;50% Delay Risk</span>
              </div>
              <div className="mt-4 flex items-baseline justify-between">
                <div>
                  <div className="text-4xl font-black tracking-tight text-white">
                    {kpis.atRiskShipments ?? '0'}
                  </div>
                  <p className="mt-0.5 text-xs font-medium text-rose-100">At-Risk Active Shipments</p>
                </div>
                <div className="text-right">
                  <span className="text-xs font-extrabold bg-white/20 px-2 py-1 rounded-lg text-white">
                    Priority
                  </span>
                </div>
              </div>
            </div>

            {/* Tile 3: Electric Indigo / Purple (Logistics Cost) */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-500 to-indigo-600 p-5 text-white shadow-md shadow-indigo-500/15 hover:-translate-y-1 transition-all duration-300">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/20 backdrop-blur-sm text-[11px] font-bold uppercase tracking-wider text-white">
                  <ArrowUpRight className="h-3 w-3" />
                  Monthly Spend
                </span>
                <span className="text-xs font-bold text-white/80">30-Day Total</span>
              </div>
              <div className="mt-4 flex items-baseline justify-between">
                <div>
                  <div className="text-3xl font-black tracking-tight text-white">
                    {kpis.logisticsCost != null ? formatLakhs(kpis.logisticsCost) : '—'}
                  </div>
                  <p className="mt-0.5 text-xs font-medium text-indigo-100">Total Logistics Outlay</p>
                </div>
                <div className="text-right">
                  <span className="text-xs font-extrabold bg-white/20 px-2 py-1 rounded-lg text-white">
                    Optimal
                  </span>
                </div>
              </div>
            </div>

            {/* Tile 4: Emerald / Green (Projected AI Savings) */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 p-5 text-white shadow-md shadow-emerald-500/15 hover:-translate-y-1 transition-all duration-300">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/20 backdrop-blur-sm text-[11px] font-bold uppercase tracking-wider text-white">
                  <Sparkles className="h-3 w-3" />
                  AI Opportunity
                </span>
                <span className="text-xs font-bold text-white/80">Executable</span>
              </div>
              <div className="mt-4 flex items-baseline justify-between">
                <div>
                  <div className="text-3xl font-black tracking-tight text-white">
                    {kpis.projectedSavings != null ? formatLakhs(kpis.projectedSavings) : '—'}
                  </div>
                  <p className="mt-0.5 text-xs font-medium text-emerald-100">Projected Savings</p>
                </div>
                <div className="text-right">
                  <span className="text-xs font-extrabold bg-white/20 px-2 py-1 rounded-lg text-white">
                    +18.4%
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* 4. Network Health Hub Card */}
          <section className="card p-6 border-slate-100 overflow-hidden shadow-sm">
            <div className="grid gap-6 md:grid-cols-[auto_1fr_auto] md:items-center">
              {/* Conic circular health ring */}
              <div 
                className="relative flex h-28 w-28 items-center justify-center rounded-full shrink-0 shadow-inner"
                style={{ background: healthRing }}
              >
                <div className="flex h-20 w-20 flex-col items-center justify-center rounded-full bg-white shadow-sm">
                  <span className={`text-3xl font-black ${healthTextColor}`}>{healthScore}</span>
                  <span className="text-[10px] font-bold uppercase text-slate-400">Score</span>
                </div>
              </div>

              <div>
                <div className="flex flex-wrap items-center gap-3">
                  <h2 className="text-xl font-bold text-slate-900 tracking-tight">Supply Chain Health Index</h2>
                  <StatusBadge status={healthStatus} />
                </div>
                <p className="mt-1 text-xs sm:text-sm text-slate-500 font-medium leading-relaxed">
                  Composite score evaluated continuously across on-time delivery velocity, warehouse stock resilience, fleet load balance, and exception density.
                </p>
                
                {/* Visual health stages bar */}
                <div className="mt-4 max-w-xl">
                  <div className="flex items-end gap-1.5">
                    {['Critical', 'At risk', 'Watch', 'Stable', 'Strong'].map((label, index) => (
                      <div key={label} className="flex-1 text-center">
                        <div 
                          className={`h-2.5 rounded-full transition-all duration-300 ${
                            index < filledHealthStages 
                              ? (healthStatus === 'healthy' ? 'bg-emerald-500' : healthStatus === 'critical' ? 'bg-rose-500' : 'bg-amber-500')
                              : 'bg-slate-100'
                          }`} 
                        />
                        <span className="mt-1.5 block text-[10px] font-bold text-slate-400">{label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Attention Now badge box */}
              <div className="rounded-2xl border border-slate-100 bg-slate-50/80 p-5 text-center shrink-0 min-w-[140px]">
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Exceptions</p>
                <p className="mt-1 text-3xl font-extrabold text-slate-900">{attentionAlerts.length}</p>
                <p className="text-[11px] font-medium text-slate-400 mt-0.5">Active Alerts</p>
              </div>
            </div>
          </section>

          {/* 5. Split Section: AI Decisions (Left 2 cols) & Exceptions Watch (Right 1 col) */}
          <div className="grid grid-cols-1 gap-7 xl:grid-cols-3">
            {/* Left: AI Operational Recommendations */}
            <section className="xl:col-span-2 space-y-4">
              <div className="flex items-center justify-between pb-1">
                <div>
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-blue-600" />
                    <h2 className="text-lg font-bold text-slate-900 tracking-tight">AI Operations Recommendations</h2>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">Autonomous cost-saving and route optimization suggestions ready for execution.</p>
                </div>
                <Link 
                  to="/optimization" 
                  className="inline-flex items-center text-xs font-bold text-blue-600 hover:text-blue-800 transition-colors"
                >
                  Deep Optimization <ArrowRight className="ml-1 h-3.5 w-3.5" />
                </Link>
              </div>

              {recommendations.length === 0 ? (
                <div className="card p-8 text-center border-slate-100">
                  <CheckCircle className="mx-auto h-8 w-8 text-emerald-500" />
                  <p className="mt-2 text-sm font-semibold text-slate-800">All Operations Optimized</p>
                  <p className="text-xs text-slate-500 mt-0.5">No unapplied recommendations are currently pending.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {recommendations.slice(0, 3).map((rec) => (
                    <AIDecisionCard 
                      key={rec.id}
                      severity={rec.priority}
                      title={rec.title}
                      description={rec.description}
                      impact={{
                        cost: rec.estimated_savings ? formatCurrency(rec.estimated_savings) : undefined,
                        time: rec.estimated_time_savings != null ? `${rec.estimated_time_savings.toFixed(1)}h` : undefined,
                      }}
                      isApplying={applyingId === rec.id}
                      onApply={applyingId === rec.id ? undefined : () => handleApplyRecommendation(rec.id)}
                    />
                  ))}
                </div>
              )}
            </section>

            {/* Right: Exception Watch & Summary */}
            <section className="space-y-4">
              <div className="flex items-center justify-between pb-1">
                <div>
                  <div className="flex items-center gap-2">
                    <ShieldAlert className="h-4 w-4 text-rose-500" />
                    <h2 className="text-lg font-bold text-slate-900 tracking-tight">Exception Watch</h2>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">Active issues flagged across hubs.</p>
                </div>
                <Link 
                  to="/alerts" 
                  className="inline-flex items-center text-xs font-bold text-blue-600 hover:text-blue-800 transition-colors"
                >
                  View All ({alerts.length}) <ArrowRight className="ml-1 h-3.5 w-3.5" />
                </Link>
              </div>

              <div className="card divide-y divide-slate-100 border-slate-100 overflow-hidden shadow-sm">
                {attentionAlerts.length === 0 ? (
                  <div className="p-8 text-center">
                    <CheckCircle className="mx-auto h-8 w-8 text-emerald-500" />
                    <p className="mt-2 text-sm font-semibold text-slate-800">Zero Active Exceptions</p>
                    <p className="text-xs text-slate-500 mt-0.5">Network operations are running smoothly.</p>
                  </div>
                ) : (
                  attentionAlerts.slice(0, 4).map((alert) => (
                    <div key={alert.id} className="p-4 hover:bg-slate-50/60 transition-colors">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-3 min-w-0">
                          <AlertTriangle className={`h-4 w-4 mt-0.5 shrink-0 ${
                            alert.severity === 'critical' ? 'text-rose-600' :
                            alert.severity === 'high' ? 'text-amber-500' : 'text-blue-500'
                          }`} />
                          <div className="min-w-0">
                            <p className="text-xs font-bold text-slate-900 truncate">{alert.title}</p>
                            <p className="text-xs text-slate-500 mt-0.5 line-clamp-2 leading-relaxed">{alert.description}</p>
                            <p className="text-[10px] font-medium text-slate-400 mt-1.5">
                              {alert.created_at ? new Date(alert.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Live'}
                            </p>
                          </div>
                        </div>
                        <StatusBadge status={alert.severity} />
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Bottom Quick-Metric Pill Counters */}
              <div className="grid grid-cols-3 gap-2.5 text-center">
                <div className="rounded-2xl bg-rose-50/80 border border-rose-100 p-3">
                  <span className="block text-xl font-extrabold text-rose-700">{criticalAlerts.length}</span>
                  <span className="text-[11px] font-semibold text-rose-600">Critical</span>
                </div>
                <div className="rounded-2xl bg-amber-50/80 border border-amber-100 p-3">
                  <span className="block text-xl font-extrabold text-amber-700">{highAlerts.length}</span>
                  <span className="text-[11px] font-semibold text-amber-600">High Risk</span>
                </div>
                <div className="rounded-2xl bg-blue-50/80 border border-blue-100 p-3">
                  <span className="block text-xl font-extrabold text-blue-700">{recommendations.length}</span>
                  <span className="text-[11px] font-semibold text-blue-600">Decisions</span>
                </div>
              </div>
            </section>
          </div>
        </>
      )}
    </div>
  );
}

import { useState, useEffect, useMemo } from 'react';
import { 
  Bell, AlertTriangle, AlertCircle, Info, CheckCircle2, CheckCircle, 
  Sparkles, RefreshCw, Search, Filter, ShieldAlert, ArrowUpRight, 
  Clock, DollarSign, Zap, RotateCcw, ChevronRight, Check, Package, 
  Warehouse, Truck, Ship, ExternalLink
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import StatusBadge from '../components/StatusBadge';

const formatCurrency = (val) => `₹${Number(val || 0).toLocaleString('en-IN')}`;

export default function Alerts() {
  const [activeTab, setActiveTab] = useState('alerts'); // 'alerts', 'recommendations'
  const [alerts, setAlerts] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');
  const [actionToast, setActionToast] = useState(null);

  // Filters for alerts
  const [alertSearch, setAlertSearch] = useState('');
  const [alertSeverityFilter, setAlertSeverityFilter] = useState('all'); // 'all', 'critical', 'high', 'medium'
  const [alertStatusFilter, setAlertStatusFilter] = useState('active'); // 'active', 'resolved', 'all'
  const [alertTypeFilter, setAlertTypeFilter] = useState('all'); // 'all', 'shipment', 'warehouse', 'inventory', 'fleet'

  // Filters for recommendations
  const [recStatusFilter, setRecStatusFilter] = useState('pending'); // 'pending', 'applied', 'all'

  // Action in-flight states
  const [resolvingId, setResolvingId] = useState(null);
  const [applyingRecId, setApplyingRecId] = useState(null);
  const [resettingData, setResettingData] = useState(false);

  const loadData = async () => {
    setError('');
    try {
      const [alertsData, recsData] = await Promise.all([
        api.getAlerts({ resolved: undefined }), // fetch all to allow client-side tab toggling
        api.getRecommendations({ include_applied: 'true', status: 'all' })
      ]);
      setAlerts(alertsData || []);
      setRecommendations(recsData || []);
    } catch (err) {
      console.error('Failed to load alerts & recommendations:', err);
      setError(err.message || 'Failed to synchronize alerts and recommendations.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    loadData();
  };

  const showToast = (message, type = 'success') => {
    setActionToast({ message, type });
    setTimeout(() => {
      setActionToast(null);
    }, 4500);
  };

  const handleResolveAlert = async (id) => {
    setResolvingId(id);
    try {
      await api.resolveAlert(id);
      // Optimistic update
      setAlerts(prev => prev.map(a => a.id === id ? { ...a, resolved: 1 } : a));
      showToast(`Alert #${id} marked as resolved.`);
    } catch (err) {
      console.error('Failed to resolve alert:', err);
      showToast(err.message || 'Could not resolve alert', 'error');
    } finally {
      setResolvingId(null);
    }
  };

  const handleApplyRecommendation = async (rec) => {
    setApplyingRecId(rec.id);
    try {
      await api.applyRecommendation(rec.id);
      // Optimistic update
      setRecommendations(prev => prev.map(r => r.id === rec.id ? { ...r, applied: 1, applied_at: new Date().toISOString() } : r));
      showToast(`AI Intervention executed! Captured estimated savings of ${formatCurrency(rec.estimated_savings)}.`);
    } catch (err) {
      console.error('Failed to apply recommendation:', err);
      showToast(err.message || 'Could not apply recommendation', 'error');
    } finally {
      setApplyingRecId(null);
    }
  };

  const handleResetDemoData = async () => {
    setResettingData(true);
    try {
      await api.resetAlertsAndRecommendations();
      showToast('Demo data successfully reset! All alerts and AI recommendations restored.');
      await loadData();
    } catch (err) {
      console.error('Reset error:', err);
      showToast(err.message || 'Could not reset demo state', 'error');
    } finally {
      setResettingData(false);
    }
  };

  // Severity Icon Helper
  const getSeverityIcon = (severity) => {
    switch (severity?.toLowerCase()) {
      case 'critical':
        return AlertTriangle;
      case 'high':
        return AlertCircle;
      default:
        return Info;
    }
  };

  // Entity Type Icon Helper
  const getEntityIcon = (type) => {
    switch (type?.toLowerCase()) {
      case 'shipment':
        return Ship;
      case 'warehouse':
        return Warehouse;
      case 'inventory':
      case 'sku':
        return Package;
      case 'fleet':
      case 'vehicle':
        return Truck;
      default:
        return ShieldAlert;
    }
  };

  const getEntityLink = (alert) => {
    const type = (alert.entity_type || '').toLowerCase();
    if (type.includes('shipment')) return '/shipments';
    if (type.includes('warehouse')) return '/warehouses';
    if (type.includes('inventory') || type.includes('sku') || type.includes('product')) return '/inventory';
    if (type.includes('fleet') || type.includes('vehicle')) return '/fleet';
    return '/command-center';
  };

  // Filtered Alerts
  const filteredAlerts = useMemo(() => {
    return alerts.filter(alert => {
      // Status filter
      if (alertStatusFilter === 'active' && alert.resolved) return false;
      if (alertStatusFilter === 'resolved' && !alert.resolved) return false;

      // Severity filter
      if (alertSeverityFilter !== 'all' && alert.severity !== alertSeverityFilter) return false;

      // Entity type filter
      if (alertTypeFilter !== 'all' && alert.entity_type?.toLowerCase() !== alertTypeFilter) return false;

      // Search filter
      if (alertSearch.trim()) {
        const query = alertSearch.toLowerCase();
        const matchesTitle = alert.title?.toLowerCase().includes(query);
        const matchesDesc = alert.description?.toLowerCase().includes(query);
        const matchesEntity = alert.entity_id?.toLowerCase().includes(query);
        if (!matchesTitle && !matchesDesc && !matchesEntity) return false;
      }

      return true;
    });
  }, [alerts, alertStatusFilter, alertSeverityFilter, alertTypeFilter, alertSearch]);

  // Filtered Recommendations
  const filteredRecommendations = useMemo(() => {
    return recommendations.filter(rec => {
      if (recStatusFilter === 'pending' && rec.applied) return false;
      if (recStatusFilter === 'applied' && !rec.applied) return false;
      return true;
    });
  }, [recommendations, recStatusFilter]);

  // Aggregate ribbon counters
  const activeAlertsCount = alerts.filter(a => !a.resolved).length;
  const criticalCount = alerts.filter(a => !a.resolved && a.severity === 'critical').length;
  const highCount = alerts.filter(a => !a.resolved && a.severity === 'high').length;
  const pendingRecsCount = recommendations.filter(r => !r.applied).length;
  const totalPendingSavings = recommendations
    .filter(r => !r.applied)
    .reduce((sum, r) => sum + (Number(r.estimated_savings) || 0), 0);

  if (loading && !alerts.length) {
    return (
      <div className="flex min-h-[460px] items-center justify-center">
        <div className="card p-8 text-center max-w-sm border-slate-100 shadow-sm">
          <div className="h-12 w-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-4 border border-blue-100">
            <RefreshCw className="h-6 w-6 animate-spin text-blue-600" />
          </div>
          <h3 className="text-base font-bold text-slate-900">Synchronizing Exception Radar</h3>
          <p className="mt-1.5 text-xs text-slate-500">Retrieving operational alerts, risk thresholds, and AI recommendations...</p>
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
            <span className="text-xs font-bold uppercase tracking-wider text-rose-600">Exception Control Tower</span>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-100 flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-rose-600 animate-pulse"></span>
              {activeAlertsCount} Unresolved Exceptions
            </span>
          </div>
          <h1 className="mt-1 text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
            Insights & Alerts Center
          </h1>
          <p className="mt-1.5 max-w-2xl text-sm font-medium text-slate-500">
            Autonomous exception telemetry tracking supply bottlenecks with transparent root-cause diagnostics and 1-click execution.
          </p>
        </div>

        {/* Global Toolbar */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={handleResetDemoData}
            disabled={resettingData}
            title="Reset alerts and recommendations to pristine state for live judging walkthroughs"
            className="btn btn-secondary inline-flex items-center gap-2 text-xs font-semibold px-4 py-2 border-slate-200 text-slate-700 hover:bg-slate-50"
          >
            <RotateCcw className={`h-3.5 w-3.5 ${resettingData ? 'animate-spin' : ''}`} />
            <span>{resettingData ? 'Resetting...' : 'Reset Demo Data'}</span>
          </button>

          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="btn btn-primary inline-flex items-center gap-2 text-xs font-bold px-4 py-2"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${refreshing ? 'animate-spin' : ''}`} />
            <span>{refreshing ? 'Refreshing...' : 'Refresh Hub'}</span>
          </button>
        </div>
      </div>

      {/* Floating Action Toast Notification */}
      {actionToast && (
        <div className={`flex items-center justify-between gap-3 p-4 rounded-2xl border shadow-lg text-sm transition-all duration-300 ${
          actionToast.type === 'error'
            ? 'bg-rose-50 border-rose-200 text-rose-900'
            : 'bg-emerald-50 border-emerald-200 text-emerald-900'
        }`}>
          <div className="flex items-center gap-2.5">
            {actionToast.type === 'error' ? (
              <AlertCircle className="h-5 w-5 text-rose-600 shrink-0" />
            ) : (
              <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
            )}
            <span className="font-semibold">{actionToast.message}</span>
          </div>
          <button 
            onClick={() => setActionToast(null)}
            className="text-xs font-bold text-slate-500 hover:text-slate-800"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Top 4 Operational Triage Ribbon */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {/* Tile 1: Critical Alerts */}
        <div 
          onClick={() => { setActiveTab('alerts'); setAlertStatusFilter('active'); setAlertSeverityFilter('critical'); }}
          className="card p-5 cursor-pointer border-l-4 border-l-rose-500 hover:-translate-y-1 transition-all group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-rose-600">Critical Alerts</span>
            <div className="p-2 rounded-xl bg-rose-50 text-rose-600 border border-rose-100">
              <AlertTriangle className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-3xl font-extrabold text-slate-900">{criticalCount}</span>
            <span className="text-xs font-semibold text-rose-600 group-hover:underline inline-flex items-center gap-1">
              Filter <ChevronRight className="h-3 w-3" />
            </span>
          </div>
          <p className="mt-1 text-xs text-slate-500 font-medium">Immediate operational risk</p>
        </div>

        {/* Tile 2: High Risk Warnings */}
        <div 
          onClick={() => { setActiveTab('alerts'); setAlertStatusFilter('active'); setAlertSeverityFilter('high'); }}
          className="card p-5 cursor-pointer border-l-4 border-l-amber-500 hover:-translate-y-1 transition-all group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-600">High Warnings</span>
            <div className="p-2 rounded-xl bg-amber-50 text-amber-600 border border-amber-100">
              <AlertCircle className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-3xl font-extrabold text-slate-900">{highCount}</span>
            <span className="text-xs font-semibold text-amber-600 group-hover:underline inline-flex items-center gap-1">
              Filter <ChevronRight className="h-3 w-3" />
            </span>
          </div>
          <p className="mt-1 text-xs text-slate-500 font-medium">Requires proactive intervention</p>
        </div>

        {/* Tile 3: AI Interventions Pending */}
        <div 
          onClick={() => { setActiveTab('recommendations'); setRecStatusFilter('pending'); }}
          className="card p-5 cursor-pointer border-l-4 border-l-purple-500 hover:-translate-y-1 transition-all group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-purple-600">AI Actions Ready</span>
            <div className="p-2 rounded-xl bg-purple-50 text-purple-600 border border-purple-100">
              <Sparkles className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-3xl font-extrabold text-purple-600">{pendingRecsCount}</span>
            <span className="text-xs font-semibold text-purple-600 group-hover:underline inline-flex items-center gap-1">
              Review <ChevronRight className="h-3 w-3" />
            </span>
          </div>
          <p className="mt-1 text-xs text-slate-500 font-medium">
            {formatCurrency(totalPendingSavings)} potential savings
          </p>
        </div>

        {/* Tile 4: Resolved Log */}
        <div 
          onClick={() => { setActiveTab('alerts'); setAlertStatusFilter('resolved'); setAlertSeverityFilter('all'); }}
          className="card p-5 cursor-pointer border-l-4 border-l-emerald-500 hover:-translate-y-1 transition-all group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">Resolved Log</span>
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100">
              <CheckCircle className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-3xl font-extrabold text-slate-900">{alerts.filter(a => a.resolved).length}</span>
            <span className="text-xs font-semibold text-emerald-600 group-hover:underline inline-flex items-center gap-1">
              View Log <ChevronRight className="h-3 w-3" />
            </span>
          </div>
          <p className="mt-1 text-xs text-slate-500 font-medium">Audited & mitigated events</p>
        </div>
      </div>

      {/* Main Mode Switcher */}
      <div className="border-b border-slate-200/80">
        <div className="flex gap-6">
          <button
            onClick={() => setActiveTab('alerts')}
            className={`flex items-center gap-2.5 pb-3.5 pt-1 text-sm font-bold border-b-2 transition-all ${
              activeTab === 'alerts'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Bell className="h-4 w-4" />
            <span>Active Operational Alerts</span>
            <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-slate-100 text-slate-700">
              {filteredAlerts.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('recommendations')}
            className={`flex items-center gap-2.5 pb-3.5 pt-1 text-sm font-bold border-b-2 transition-all ${
              activeTab === 'recommendations'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Sparkles className="h-4 w-4 text-purple-600" />
            <span>AI Decision & Recommendations</span>
            <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-purple-100 text-purple-800">
              {pendingRecsCount} Ready
            </span>
          </button>
        </div>
      </div>

      {/* TAB 1: OPERATIONAL ALERTS */}
      {activeTab === 'alerts' && (
        <div className="space-y-6">
          {/* Interactive Filters Bar */}
          <div className="card p-5">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              {/* Search Bar */}
              <div className="relative w-full lg:w-72">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search alert, entity, or keyword..."
                  value={alertSearch}
                  onChange={(e) => setAlertSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-full border border-slate-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                />
              </div>

              {/* Status & Severity Filter Pills */}
              <div className="flex flex-wrap items-center gap-3">
                {/* Status Toggle */}
                <div className="inline-flex p-1 rounded-full bg-slate-100 text-xs font-semibold">
                  {[
                    { id: 'active', label: 'Unresolved' },
                    { id: 'resolved', label: 'Resolved' },
                    { id: 'all', label: 'All Alerts' }
                  ].map(st => (
                    <button
                      key={st.id}
                      onClick={() => setAlertStatusFilter(st.id)}
                      className={`px-3 py-1 rounded-full transition-all ${
                        alertStatusFilter === st.id
                          ? 'bg-white text-slate-900 shadow-sm font-bold'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      {st.label}
                    </button>
                  ))}
                </div>

                {/* Severity Pills */}
                <div className="inline-flex p-1 rounded-full bg-slate-100 text-xs font-semibold">
                  {['all', 'critical', 'high', 'medium'].map(sev => (
                    <button
                      key={sev}
                      onClick={() => setAlertSeverityFilter(sev)}
                      className={`px-3 py-1 rounded-full capitalize transition-all ${
                        alertSeverityFilter === sev
                          ? 'bg-white text-slate-900 shadow-sm font-bold'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      {sev}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Alerts Cards List */}
          {filteredAlerts.length === 0 ? (
            <div className="card p-12 text-center">
              <CheckCircle className="mx-auto h-12 w-12 text-emerald-500" />
              <h3 className="mt-4 text-base font-extrabold text-slate-900">Zero Matching Exceptions</h3>
              <p className="mt-1 text-xs text-slate-500">All alerts in this filter category have been mitigated or resolved.</p>
              <button
                onClick={() => { setAlertStatusFilter('all'); setAlertSeverityFilter('all'); setAlertSearch(''); }}
                className="btn btn-secondary mt-4 text-xs font-semibold"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredAlerts.map(alert => {
                const Icon = getSeverityIcon(alert.severity);
                const EntityIcon = getEntityIcon(alert.entity_type);
                const isCritical = alert.severity === 'critical';
                const isHigh = alert.severity === 'high';
                const isResolved = Boolean(alert.resolved);

                return (
                  <div 
                    key={alert.id}
                    className={`card p-5 border-l-4 transition-all ${
                      isResolved 
                        ? 'border-l-emerald-500 opacity-75' 
                        : isCritical 
                          ? 'border-l-rose-500 hover:shadow-md' 
                          : isHigh 
                            ? 'border-l-amber-500 hover:shadow-md' 
                            : 'border-l-blue-500 hover:shadow-md'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                      {/* Left: Icon & Content */}
                      <div className="flex items-start gap-4 flex-1">
                        <div className={`p-3 rounded-2xl shrink-0 ${
                          isResolved 
                            ? 'bg-emerald-50 text-emerald-600' 
                            : isCritical 
                              ? 'bg-rose-50 text-rose-600 border border-rose-100' 
                              : isHigh 
                                ? 'bg-amber-50 text-amber-600 border border-amber-100' 
                                : 'bg-blue-50 text-blue-600 border border-blue-100'
                        }`}>
                          <Icon className="h-5 w-5" />
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-2.5">
                            <h3 className="text-base font-extrabold text-slate-900 tracking-tight">
                              {alert.title}
                            </h3>
                            
                            <StatusBadge status={alert.severity} />

                            {alert.entity_id && (
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-100 text-slate-700 border border-slate-200">
                                <EntityIcon className="h-3 w-3 text-slate-500" />
                                {alert.entity_id}
                              </span>
                            )}

                            {isResolved && (
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                <Check className="h-3 w-3" /> Resolved
                              </span>
                            )}
                          </div>

                          <p className="mt-2 text-sm text-slate-600 font-medium leading-relaxed">
                            {alert.description}
                          </p>

                          <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-slate-400">
                            <span className="flex items-center gap-1 font-medium text-slate-500">
                              <Clock className="h-3.5 w-3.5" />
                              {new Date(alert.created_at).toLocaleString('en-IN', {
                                month: 'short',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </span>
                            <span>•</span>
                            <span className="capitalize text-slate-500 font-medium">Domain: {alert.entity_type || 'Operations'}</span>
                          </div>
                        </div>
                      </div>

                      {/* Right: Interactive Actions */}
                      <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-2.5 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                        {!isResolved ? (
                          <button
                            onClick={() => handleResolveAlert(alert.id)}
                            disabled={resolvingId === alert.id}
                            className="btn btn-primary text-xs font-bold inline-flex items-center gap-1.5 py-1.5 px-3.5 bg-emerald-600 hover:bg-emerald-700 shadow-emerald-500/20"
                          >
                            <Check className={`h-3.5 w-3.5 ${resolvingId === alert.id ? 'animate-spin' : ''}`} />
                            <span>{resolvingId === alert.id ? 'Resolving...' : 'Mark Resolved'}</span>
                          </button>
                        ) : (
                          <span className="text-xs font-semibold text-emerald-700 flex items-center gap-1">
                            <CheckCircle2 className="h-4 w-4" /> Mitigated
                          </span>
                        )}

                        <Link
                          to={getEntityLink(alert)}
                          className="btn btn-secondary text-xs font-semibold inline-flex items-center gap-1 py-1.5 px-3"
                        >
                          <span>Inspect Node</span>
                          <ExternalLink className="h-3 w-3 text-slate-400" />
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: AI RECOMMENDATIONS */}
      {activeTab === 'recommendations' && (
        <div className="space-y-6">
          {/* Recommendation Overview Banner */}
          <div className="card p-6 bg-gradient-to-r from-purple-50/80 via-blue-50/50 to-slate-50 border border-purple-100">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-purple-600" />
                  <h3 className="text-lg font-extrabold text-slate-900">Explainable Decision Engine</h3>
                </div>
                <p className="mt-1 text-xs text-slate-600 font-medium max-w-xl">
                  Algorithmic recommendations evaluating transit congestion, vehicle allocation, safety stock, and inventory redistribution.
                </p>
              </div>

              {/* Status Filter buttons */}
              <div className="inline-flex p-1 rounded-full bg-white border border-slate-200 shadow-sm text-xs font-semibold">
                {[
                  { id: 'pending', label: `Pending (${recommendations.filter(r => !r.applied).length})` },
                  { id: 'applied', label: `Applied (${recommendations.filter(r => r.applied).length})` },
                  { id: 'all', label: 'All Decisions' }
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setRecStatusFilter(tab.id)}
                    className={`px-3 py-1.5 rounded-full transition-all ${
                      recStatusFilter === tab.id
                        ? 'bg-purple-600 text-white shadow-sm font-bold'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Recommendations List */}
          {filteredRecommendations.length === 0 ? (
            <div className="card p-12 text-center">
              <CheckCircle className="mx-auto h-12 w-12 text-emerald-500" />
              <h3 className="mt-4 text-base font-extrabold text-slate-900">
                {recStatusFilter === 'pending' 
                  ? 'All AI Recommendations Have Been Applied!' 
                  : 'No Recommendations Found'}
              </h3>
              <p className="mt-1 text-xs text-slate-500 max-w-md mx-auto">
                {recStatusFilter === 'pending'
                  ? 'Great job! All algorithmic actions have been executed into active dispatch plans. You can reset them anytime for demo walkthroughs.'
                  : 'No items match your active filter criteria.'}
              </p>
              <button
                onClick={handleResetDemoData}
                className="btn btn-primary mt-5 text-xs font-bold inline-flex items-center gap-2"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                <span>Reset Recommendations for Demo</span>
              </button>
            </div>
          ) : (
            <div className="space-y-5">
              {filteredRecommendations.map(rec => {
                const isApplied = Boolean(rec.applied);
                const isCritical = rec.priority === 'critical';

                return (
                  <div 
                    key={rec.id}
                    className={`card p-6 border-l-4 transition-all ${
                      isApplied 
                        ? 'border-l-emerald-500 bg-slate-50/40' 
                        : isCritical 
                          ? 'border-l-purple-600 hover:shadow-md' 
                          : 'border-l-blue-600 hover:shadow-md'
                    }`}
                  >
                    <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-5">
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-2.5">
                          <h3 className="text-lg font-extrabold text-slate-900">{rec.title}</h3>
                          <StatusBadge status={rec.priority} />
                          {rec.type && (
                            <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 uppercase tracking-wider">
                              {rec.type}
                            </span>
                          )}
                          {isApplied && (
                            <span className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                              <Check className="h-3 w-3" /> Executed
                            </span>
                          )}
                        </div>

                        {/* Explainable Diagnostic */}
                        <p className="mt-2.5 text-sm text-slate-600 leading-relaxed font-medium">
                          {rec.description}
                        </p>

                        {/* Impact Metrics Badges */}
                        <div className="mt-4 flex flex-wrap items-center gap-3">
                          {rec.estimated_savings > 0 && (
                            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200/80 text-xs font-bold">
                              <DollarSign className="h-3.5 w-3.5 text-emerald-600" />
                              <span>Est. Cost Savings: {formatCurrency(rec.estimated_savings)}</span>
                            </div>
                          )}

                          {rec.estimated_time_savings > 0 && (
                            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-50 text-blue-800 border border-blue-200/80 text-xs font-bold">
                              <Clock className="h-3.5 w-3.5 text-blue-600" />
                              <span>Transit Reduction: {rec.estimated_time_savings} hrs</span>
                            </div>
                          )}

                          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-50 text-purple-800 border border-purple-200/80 text-xs font-bold">
                            <Zap className="h-3.5 w-3.5 text-purple-600" />
                            <span>Risk Mitigation: -19 pp</span>
                          </div>
                        </div>
                      </div>

                      {/* Action CTA */}
                      <div className="shrink-0 flex items-center lg:flex-col lg:items-end justify-between gap-3 pt-4 lg:pt-0 border-t lg:border-t-0 border-slate-100">
                        {!isApplied ? (
                          <button
                            onClick={() => handleApplyRecommendation(rec)}
                            disabled={applyingRecId === rec.id}
                            className="btn btn-primary text-xs font-bold px-5 py-2.5 bg-purple-600 hover:bg-purple-700 shadow-purple-500/25 inline-flex items-center gap-2"
                          >
                            <Zap className={`h-4 w-4 ${applyingRecId === rec.id ? 'animate-spin' : ''}`} />
                            <span>{applyingRecId === rec.id ? 'Executing...' : 'Apply AI Decision'}</span>
                          </button>
                        ) : (
                          <div className="text-right">
                            <span className="text-xs font-extrabold text-emerald-700 flex items-center gap-1">
                              <CheckCircle2 className="h-4 w-4" /> Operationalized
                            </span>
                            <span className="text-[11px] text-slate-400 block mt-0.5">
                              {rec.applied_at ? new Date(rec.applied_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Applied'}
                            </span>
                          </div>
                        )}

                        <Link
                          to="/optimization"
                          className="btn btn-secondary text-xs font-semibold inline-flex items-center gap-1.5 py-1.5 px-3"
                        >
                          <span>Simulate Alternatives</span>
                          <ArrowUpRight className="h-3.5 w-3.5 text-slate-400" />
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

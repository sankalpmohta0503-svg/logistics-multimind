import { useState, useEffect, useMemo } from 'react';
import { 
  Ship, Truck, AlertTriangle, ArrowRight, CheckCircle, Clock, 
  Search, Download, RefreshCw, MapPin, Calendar, DollarSign, 
  Filter, ShieldAlert, Sparkles, ChevronRight, X, ArrowUpRight,
  Eye, Navigation, Gauge
} from 'lucide-react';
import StatusBadge from '../components/StatusBadge';
import { api } from '../services/api';

const formatCurrency = (val) => val != null ? `₹${Number(val).toLocaleString('en-IN')}` : '—';

export default function Shipments() {
  const [shipments, setShipments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedShipment, setSelectedShipment] = useState(null);

  const loadShipments = async () => {
    setLoading(true);
    setError('');
    try {
      // Fetch all shipments to allow client-side rich filtering across statuses and risk
      const data = await api.getShipments();
      setShipments(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to load shipments:', err);
      setError(err.message || 'Failed to load shipments.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadShipments();
  }, []);

  // Filtered shipments
  const filteredShipments = useMemo(() => {
    return shipments.filter(s => {
      const term = searchTerm.toLowerCase();
      const matchesSearch = 
        s.id?.toLowerCase().includes(term) ||
        s.order_id?.toLowerCase().includes(term) ||
        s.destination?.toLowerCase().includes(term) ||
        s.origin_name?.toLowerCase().includes(term) ||
        s.vehicle_id?.toLowerCase().includes(term) ||
        s.route_name?.toLowerCase().includes(term);

      const matchesStatus = 
        statusFilter === 'all' ? true :
        statusFilter === 'at_risk' ? (s.delay_probability > 0.5 && s.status !== 'delivered') :
        s.status === statusFilter;

      const matchesPriority = 
        priorityFilter === 'all' ? true : s.priority === priorityFilter;

      return matchesSearch && matchesStatus && matchesPriority;
    });
  }, [shipments, searchTerm, statusFilter, priorityFilter]);

  // Aggregate metrics for compact top strip
  const metrics = useMemo(() => {
    const total = shipments.length;
    const inTransit = shipments.filter(s => s.status === 'in_transit').length;
    const dispatched = shipments.filter(s => s.status === 'dispatched').length;
    const planned = shipments.filter(s => s.status === 'planned').length;
    const delivered = shipments.filter(s => s.status === 'delivered').length;
    const atRisk = shipments.filter(s => s.delay_probability > 0.5 && s.status !== 'delivered').length;
    const totalCost = shipments.reduce((sum, s) => sum + (s.cost || 0), 0);
    const totalWeightKg = shipments.reduce((sum, s) => sum + (s.weight_kg || 0), 0);

    return { total, inTransit, dispatched, planned, delivered, atRisk, totalCost, totalWeightKg };
  }, [shipments]);

  if (loading && shipments.length === 0) {
    return (
      <div className="flex min-h-[460px] items-center justify-center">
        <div className="card p-8 text-center max-w-sm border-slate-100 shadow-sm">
          <div className="h-12 w-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-4 border border-blue-100">
            <RefreshCw className="h-6 w-6 animate-spin text-blue-600" />
          </div>
          <h3 className="text-base font-bold text-slate-900">Tracking Active Freight</h3>
          <p className="mt-1.5 text-xs text-slate-500">Connecting to telemetry gateways, telematics OBD units, and highway transit logs...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* 1. Header & Action Toolbar */}
      <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600">Freight Telematics & Dispatch</span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-100">Live Carrier Grid</span>
          </div>
          <h1 className="mt-1 text-3xl font-extrabold tracking-tight text-slate-900">
            Shipments & Dispatch Control
          </h1>
          <p className="mt-1 max-w-2xl text-xs sm:text-sm font-medium text-slate-500">
            Real-time multi-carrier shipment monitoring, route delay probabilities, and automated exception tracking.
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
            <span>Export Manifest</span>
          </button>

          <button 
            onClick={loadShipments} 
            disabled={loading}
            className="btn btn-primary inline-flex items-center gap-2 text-xs font-bold px-5 py-2.5 shadow-md shadow-blue-500/25"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>{loading ? 'Refreshing...' : 'Refresh Loads'}</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="flex items-start justify-between gap-4 rounded-2xl border border-rose-200 bg-rose-50/80 p-4 text-sm text-rose-800 shadow-sm">
          <div className="flex items-center gap-2.5">
            <AlertTriangle className="h-4 w-4 text-rose-600 shrink-0" />
            <span>{error}</span>
          </div>
          <button className="font-semibold underline hover:text-rose-950" onClick={loadShipments}>Retry</button>
        </div>
      )}

      {/* 2. Compact Integrated Operational Ribbon (No bulky flashcards) */}
      <div className="card p-4 border-slate-100 bg-white shadow-sm">
        <div className="grid grid-cols-2 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-slate-100">
          <div className="px-4 py-2">
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Total Monitored Loads</p>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="text-2xl font-black text-slate-900">{metrics.total}</span>
              <span className="text-xs font-semibold text-slate-500">{(metrics.totalWeightKg / 1000).toFixed(1)} tons</span>
            </div>
          </div>

          <div className="px-4 py-2">
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Active In Transit</p>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="text-2xl font-black text-blue-600">{metrics.inTransit}</span>
              <span className="text-xs font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full">
                {metrics.dispatched} Dispatched
              </span>
            </div>
          </div>

          <div className="px-4 py-2">
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">At-Risk Exceptions</p>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="text-2xl font-black text-rose-600">{metrics.atRisk}</span>
              <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${metrics.atRisk > 0 ? 'bg-rose-50 text-rose-700' : 'bg-emerald-50 text-emerald-700'}`}>
                {metrics.atRisk > 0 ? 'Delay > 50%' : 'All On-Time'}
              </span>
            </div>
          </div>

          <div className="px-4 py-2">
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Total Freight Outlay</p>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="text-2xl font-black text-slate-900">
                ₹{((metrics.totalCost || 0) / 100000).toFixed(1)}L
              </span>
              <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                {metrics.delivered} Delivered
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Control Tower Filter & Search Toolbar (Inspired by Image 1) */}
      <div className="card p-4 border-slate-100 flex flex-col lg:flex-row lg:items-center justify-between gap-4 shadow-sm">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input 
            type="text"
            placeholder="Search Shipment ID, Destination, Origin, or Vehicle..."
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

        {/* Status Filter Pill Tabs */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1 p-1 bg-slate-100/80 rounded-full border border-slate-200/60 overflow-x-auto">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                statusFilter === 'all' 
                  ? 'bg-white text-slate-900 shadow-xs' 
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All ({metrics.total})
            </button>
            <button
              onClick={() => setStatusFilter('in_transit')}
              className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                statusFilter === 'in_transit' 
                  ? 'bg-blue-600 text-white shadow-xs' 
                  : 'text-blue-600 hover:text-blue-800'
              }`}
            >
              In Transit ({metrics.inTransit})
            </button>
            <button
              onClick={() => setStatusFilter('at_risk')}
              className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                statusFilter === 'at_risk' 
                  ? 'bg-rose-500 text-white shadow-xs' 
                  : 'text-rose-600 hover:text-rose-800'
              }`}
            >
              At Risk ({metrics.atRisk})
            </button>
            <button
              onClick={() => setStatusFilter('dispatched')}
              className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                statusFilter === 'dispatched' 
                  ? 'bg-amber-500 text-white shadow-xs' 
                  : 'text-amber-700 hover:text-amber-900'
              }`}
            >
              Dispatched ({metrics.dispatched})
            </button>
            <button
              onClick={() => setStatusFilter('delivered')}
              className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                statusFilter === 'delivered' 
                  ? 'bg-emerald-600 text-white shadow-xs' 
                  : 'text-emerald-700 hover:text-emerald-900'
              }`}
            >
              Delivered ({metrics.delivered})
            </button>
          </div>

          {/* Priority Filter */}
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="px-3.5 py-1.5 rounded-full border border-slate-200 bg-white text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
          >
            <option value="all">All Priorities</option>
            <option value="urgent">Urgent</option>
            <option value="high">High</option>
            <option value="normal">Normal</option>
          </select>
        </div>
      </div>

      {/* 4. Shipments Data Table (Control Tower Aesthetic) */}
      <div className="card border-slate-100 overflow-hidden shadow-sm">
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Truck className="h-4 w-4 text-blue-600" />
            <h2 className="text-base font-bold text-slate-900 tracking-tight">Active Freight Registry</h2>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
              {filteredShipments.length} Records
            </span>
          </div>

          <div className="text-xs font-medium text-slate-400">
            Click row for telemetry inspection
          </div>
        </div>

        {filteredShipments.length === 0 ? (
          <div className="p-12 text-center">
            <Ship className="mx-auto h-10 w-10 text-slate-300" />
            <h3 className="mt-3 text-sm font-bold text-slate-900">No shipments found</h3>
            <p className="mt-1 text-xs text-slate-500">No active shipments match the selected filters.</p>
            <button 
              onClick={() => { setSearchTerm(''); setStatusFilter('all'); setPriorityFilter('all'); }} 
              className="btn btn-secondary mt-4 text-xs font-semibold"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-100">
              <thead>
                <tr className="bg-slate-50/70">
                  <th scope="col" className="px-5 py-3.5 text-left text-[11px] font-bold uppercase tracking-wider text-slate-500">
                    Shipment ID & Order
                  </th>
                  <th scope="col" className="px-5 py-3.5 text-left text-[11px] font-bold uppercase tracking-wider text-slate-500">
                    Transit Corridor
                  </th>
                  <th scope="col" className="px-5 py-3.5 text-left text-[11px] font-bold uppercase tracking-wider text-slate-500">
                    Assigned Fleet
                  </th>
                  <th scope="col" className="px-5 py-3.5 text-left text-[11px] font-bold uppercase tracking-wider text-slate-500">
                    Payload & Cost
                  </th>
                  <th scope="col" className="px-5 py-3.5 text-left text-[11px] font-bold uppercase tracking-wider text-slate-500">
                    Transit Status
                  </th>
                  <th scope="col" className="px-5 py-3.5 text-left text-[11px] font-bold uppercase tracking-wider text-slate-500">
                    Delay Risk
                  </th>
                  <th scope="col" className="px-5 py-3.5 text-left text-[11px] font-bold uppercase tracking-wider text-slate-500">
                    Estimated Arrival (ETA)
                  </th>
                  <th scope="col" className="px-5 py-3.5 text-right text-[11px] font-bold uppercase tracking-wider text-slate-500">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-100">
                {filteredShipments.map((shipment) => {
                  const isHighRisk = shipment.delay_probability != null && shipment.delay_probability > 0.5;
                  const isCriticalRisk = shipment.delay_probability != null && shipment.delay_probability > 0.7;

                  return (
                    <tr 
                      key={shipment.id} 
                      onClick={() => setSelectedShipment(shipment)}
                      className="hover:bg-blue-50/40 transition-colors group cursor-pointer"
                    >
                      {/* ID & Priority */}
                      <td className="px-5 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2.5">
                          <div className={`h-8 w-8 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 ${
                            isCriticalRisk ? 'bg-rose-50 text-rose-600 border border-rose-100' :
                            isHighRisk ? 'bg-amber-50 text-amber-600 border border-amber-100' :
                            'bg-slate-50 text-slate-600 border border-slate-100'
                          }`}>
                            <Ship className="h-4 w-4" />
                          </div>
                          <div>
                            <div className="font-mono text-xs font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                              {shipment.id}
                            </div>
                            <div className="flex items-center gap-1.5 mt-0.5">
                              <span className="text-[10px] font-mono text-slate-400">
                                {shipment.order_id || 'ORD-SYNC'}
                              </span>
                              {shipment.priority === 'urgent' && (
                                <span className="px-1.5 py-0.2 rounded text-[9px] font-extrabold bg-rose-100 text-rose-700">
                                  URGENT
                                </span>
                              )}
                              {shipment.priority === 'high' && (
                                <span className="px-1.5 py-0.2 rounded text-[9px] font-extrabold bg-amber-100 text-amber-700">
                                  HIGH
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Transit Corridor (Origin -> Destination) */}
                      <td className="px-5 py-4 whitespace-nowrap">
                        <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                          <span>{shipment.origin_name ? shipment.origin_name.replace(' Warehouse', '').replace(' Distribution Center', '') : 'Origin Hub'}</span>
                          <ArrowRight className="h-3 w-3 text-slate-400 shrink-0" />
                          <span className="text-blue-600">{shipment.destination}</span>
                        </div>
                        {shipment.distance_km && (
                          <div className="text-[10px] font-medium text-slate-400 mt-0.5">
                            {shipment.distance_km} km • {shipment.route_name || 'Standard Route'}
                          </div>
                        )}
                      </td>

                      {/* Assigned Fleet */}
                      <td className="px-5 py-4 whitespace-nowrap">
                        {shipment.vehicle_id ? (
                          <div>
                            <div className="inline-flex items-center gap-1 font-mono text-xs font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded-lg border border-slate-200">
                              <Truck className="h-3 w-3 text-slate-500" />
                              {shipment.vehicle_id}
                            </div>
                            <div className="text-[10px] text-slate-400 mt-0.5">
                              {shipment.vehicle_type || 'Fleet Vehicle'}
                            </div>
                          </div>
                        ) : (
                          <span className="text-xs font-medium text-slate-400 italic">Unassigned</span>
                        )}
                      </td>

                      {/* Payload & Cost */}
                      <td className="px-5 py-4 whitespace-nowrap">
                        <div className="text-xs font-bold text-slate-900">
                          {formatCurrency(shipment.cost)}
                        </div>
                        <div className="text-[10px] text-slate-400 mt-0.5">
                          {shipment.weight_kg ? `${Number(shipment.weight_kg).toLocaleString()} kg` : 'N/A'}
                        </div>
                      </td>

                      {/* Transit Status */}
                      <td className="px-5 py-4 whitespace-nowrap">
                        <StatusBadge status={shipment.status} />
                      </td>

                      {/* Delay Risk */}
                      <td className="px-5 py-4 whitespace-nowrap">
                        {shipment.delay_probability != null ? (
                          <div className="flex items-center gap-2">
                            <div className="w-16 bg-slate-100 rounded-full h-2 overflow-hidden flex">
                              <div 
                                className={`h-2 rounded-full transition-all ${
                                  isCriticalRisk ? 'bg-rose-500' :
                                  isHighRisk ? 'bg-amber-500' :
                                  'bg-emerald-500'
                                }`}
                                style={{ width: `${Math.min(100, Math.round(shipment.delay_probability * 100))}%` }}
                              />
                            </div>
                            <span className={`text-xs font-mono font-bold flex items-center gap-1 ${
                              isCriticalRisk ? 'text-rose-600' :
                              isHighRisk ? 'text-amber-600' :
                              'text-emerald-700'
                            }`}>
                              {isHighRisk && <AlertTriangle className="h-3 w-3 shrink-0" />}
                              {(shipment.delay_probability * 100).toFixed(0)}%
                            </span>
                          </div>
                        ) : (
                          <span className="text-xs text-slate-400">Low/None</span>
                        )}
                      </td>

                      {/* ETA */}
                      <td className="px-5 py-4 whitespace-nowrap text-xs">
                        {shipment.status === 'delivered' ? (
                          <span className="inline-flex items-center gap-1 text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                            <CheckCircle className="h-3 w-3" /> Arrived
                          </span>
                        ) : shipment.eta ? (
                          <div>
                            <span className="font-semibold text-slate-800">
                              {new Date(shipment.eta).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                            </span>
                            <span className="text-slate-400 ml-1">
                              {new Date(shipment.eta).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                        ) : (
                          <span className="text-slate-400">Schedule TBD</span>
                        )}
                      </td>

                      {/* Action */}
                      <td className="px-5 py-4 whitespace-nowrap text-right">
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedShipment(shipment);
                          }}
                          className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-800 bg-blue-50/80 hover:bg-blue-100/80 px-2.5 py-1 rounded-full border border-blue-100 transition-colors"
                        >
                          <Eye className="h-3 w-3" />
                          <span>Track</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* 5. Telemetry Detail Drawer / Modal for Selected Shipment */}
      {selectedShipment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-fadeIn">
          <div className="card w-full max-w-lg p-6 bg-white border-slate-100 shadow-2xl relative">
            <button 
              onClick={() => setSelectedShipment(null)}
              className="absolute top-5 right-5 p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="flex items-center gap-2 mb-1">
              <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-100">
                {selectedShipment.id}
              </span>
              <StatusBadge status={selectedShipment.status} />
              {selectedShipment.priority && (
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                  {selectedShipment.priority} Priority
                </span>
              )}
            </div>

            <h3 className="text-xl font-extrabold text-slate-900 mt-2">
              Shipment Telematics & Corridor
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">Order ID: {selectedShipment.order_id || 'ORD-SYNC'}</p>

            <div className="mt-5 p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5 text-slate-500">
                  <MapPin className="h-3.5 w-3.5 text-slate-400" />
                  <span>Origin</span>
                </div>
                <span className="font-bold text-slate-900">{selectedShipment.origin_name || 'Warehouse Hub'}</span>
              </div>

              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5 text-slate-500">
                  <Navigation className="h-3.5 w-3.5 text-blue-500" />
                  <span>Destination</span>
                </div>
                <span className="font-bold text-blue-600">{selectedShipment.destination}</span>
              </div>

              {selectedShipment.distance_km && (
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500">Transit Distance</span>
                  <span className="font-bold text-slate-800">{selectedShipment.distance_km} km ({selectedShipment.duration_hours || 0} hrs estimated)</span>
                </div>
              )}

              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500">Assigned Vehicle</span>
                <span className="font-mono font-bold text-slate-900">{selectedShipment.vehicle_id || 'Unassigned'} ({selectedShipment.vehicle_type || 'Road'})</span>
              </div>

              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500">Payload Weight</span>
                <span className="font-bold text-slate-900">{selectedShipment.weight_kg ? `${selectedShipment.weight_kg} kg` : 'N/A'}</span>
              </div>

              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500">Total Freight Outlay</span>
                <span className="font-bold text-emerald-700">{formatCurrency(selectedShipment.cost)}</span>
              </div>
            </div>

            {/* Delay Risk Callout */}
            {selectedShipment.delay_probability != null && (
              <div className={`mt-4 p-3.5 rounded-2xl border flex items-center justify-between ${
                selectedShipment.delay_probability > 0.5 
                  ? 'bg-rose-50/80 border-rose-200 text-rose-800' 
                  : 'bg-emerald-50/80 border-emerald-200 text-emerald-800'
              }`}>
                <div className="flex items-center gap-2 text-xs">
                  {selectedShipment.delay_probability > 0.5 ? (
                    <AlertTriangle className="h-4 w-4 text-rose-600 shrink-0" />
                  ) : (
                    <CheckCircle className="h-4 w-4 text-emerald-600 shrink-0" />
                  )}
                  <div>
                    <span className="font-bold">
                      {selectedShipment.delay_probability > 0.5 ? 'Predicted Transit Delay' : 'On-Schedule Confidence'}
                    </span>
                    <p className="text-[11px] opacity-80 mt-0.5">
                      {selectedShipment.delay_probability > 0.5 
                        ? 'Traffic and route congestion indicated. Alternate routing suggested.' 
                        : 'Traffic parameters indicate smooth clearance along highway corridors.'}
                    </p>
                  </div>
                </div>
                <span className="text-lg font-black shrink-0 ml-3">
                  {(selectedShipment.delay_probability * 100).toFixed(0)}%
                </span>
              </div>
            )}

            <div className="mt-5 flex justify-end gap-2">
              <button 
                onClick={() => setSelectedShipment(null)}
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

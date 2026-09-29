import { useState, useEffect, useRef } from 'react';
import { 
  Zap, TrendingUp, ArrowRight, Sparkles, Cpu, Navigation, 
  Truck, Plane, Train, Leaf, DollarSign, Clock, ShieldAlert, 
  CheckCircle, RefreshCw, Sliders, BarChart3, Layers, Flame,
  Compass, ArrowDownRight, Check, Play, RotateCcw
} from 'lucide-react';
import { api } from '../services/api';

const formatCurrency = (val) => val != null ? `₹${Number(val).toLocaleString('en-IN')}` : '—';

export default function Optimization() {
  const [activeEngine, setActiveEngine] = useState('route'); // 'route', 'fleet', 'multimodal', 'inventory'
  
  // Route Solver State
  const [routeOrigin, setRouteOrigin] = useState('Mumbai');
  const [routeDest, setRouteDest] = useState('Pune');
  const [routeShipmentId, setRouteShipmentId] = useState('SHP-1048');
  const [routeResult, setRouteResult] = useState(null);
  const [routeLoading, setRouteLoading] = useState(false);

  // Fleet Allocator State
  const [fleetWeight, setFleetWeight] = useState(4200);
  const [fleetResult, setFleetResult] = useState(null);
  const [fleetLoading, setFleetLoading] = useState(false);

  // Multi-Modal State
  const [modalOrigin, setModalOrigin] = useState('Mumbai');
  const [modalDest, setModalDest] = useState('Delhi');
  const [modalWeight, setModalWeight] = useState(5000);
  const [modalResult, setModalResult] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);

  // Auto-run initial route solver on mount
  useEffect(() => {
    handleRunRouteOptimization();
  }, []);

  const handleRunRouteOptimization = async () => {
    setRouteLoading(true);
    try {
      const res = await api.optimizeRoute({
        shipment_id: routeShipmentId,
        origin: routeOrigin,
        destination: routeDest
      });
      setRouteResult(res);
    } catch (err) {
      console.error('Route solver failed:', err);
    } finally {
      setRouteLoading(false);
    }
  };

  const handleRunFleetOptimization = async () => {
    setFleetLoading(true);
    try {
      const res = await api.optimizeFleet({
        weight_kg: Number(fleetWeight),
        origin: routeOrigin,
        destination: routeDest
      });
      setFleetResult(res);
    } catch (err) {
      console.error('Fleet solver failed:', err);
    } finally {
      setFleetLoading(false);
    }
  };

  const handleRunMultimodalOptimization = async () => {
    setModalLoading(true);
    try {
      const res = await api.optimizeMultimodal({
        origin: modalOrigin,
        destination: modalDest,
        weight_kg: Number(modalWeight)
      });
      setModalResult(res);
    } catch (err) {
      console.error('Multimodal solver failed:', err);
    } finally {
      setModalLoading(false);
    }
  };

  return (
    <div className="space-y-7 animate-fadeIn">
      <style>{`
        @keyframes pulseGlow {
          0%, 100% { box-shadow: 0 0 15px rgba(37,99,235,0.15); }
          50% { box-shadow: 0 0 30px rgba(37,99,235,0.35); }
        }
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        @keyframes radarSweep {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .ai-glow-card {
          animation: pulseGlow 4s infinite ease-in-out;
        }
        .shimmer-active {
          background: linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.4) 50%, rgba(255,255,255,0) 100%);
          background-size: 200% 100%;
          animation: shimmer 2.5s infinite;
        }
      `}</style>

      {/* 1. Futuristic AI Studio Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-7 text-white shadow-xl group">
        {/* Interactive Antigravity Particle Field Canvas */}
        <AntigravityBackground />

        {/* Subtle background circuit texture */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1">
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
              AI Decision & Optimization Engine
            </h1>
            <p className="max-w-2xl text-xs sm:text-sm text-slate-300 font-medium">
              Multi-constraint algorithmic solver evaluating real-time highway telemetry, carrier deadhead distance, and carbon emissions.
            </p>
          </div>

          <div className="shrink-0">
            <div className="rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 px-6 py-3 text-center shadow-inner">
              <span className="text-[11px] uppercase font-bold text-slate-400 block tracking-wider">Solver Convergence</span>
              <div className="flex items-center justify-center gap-2 mt-0.5">
                <CheckCircle className="h-4 w-4 text-emerald-400" />
                <span className="text-2xl font-black text-emerald-400 font-mono">99.8%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Studio Engine Selector Pill Bar */}
        <div className="relative z-10 mt-6 pt-5 border-t border-white/10 flex flex-wrap items-center gap-2">
          <button
            onClick={() => setActiveEngine('route')}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all duration-200 ${
              activeEngine === 'route'
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/40 ring-2 ring-white/20'
                : 'bg-white/10 text-slate-300 hover:bg-white/15 hover:text-white'
            }`}
          >
            <Navigation className="h-3.5 w-3.5" />
            <span>Route Optimization</span>
          </button>

          <button
            onClick={() => {
              setActiveEngine('fleet');
              if (!fleetResult) handleRunFleetOptimization();
            }}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all duration-200 ${
              activeEngine === 'fleet'
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/40 ring-2 ring-white/20'
                : 'bg-white/10 text-slate-300 hover:bg-white/15 hover:text-white'
            }`}
          >
            <Truck className="h-3.5 w-3.5" />
            <span>Fleet Allocation Solver</span>
          </button>

          <button
            onClick={() => {
              setActiveEngine('multimodal');
              if (!modalResult) handleRunMultimodalOptimization();
            }}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all duration-200 ${
              activeEngine === 'multimodal'
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/40 ring-2 ring-white/20'
                : 'bg-white/10 text-slate-300 hover:bg-white/15 hover:text-white'
            }`}
          >
            <Plane className="h-3.5 w-3.5" />
            <span>Multi-Modal & CO₂ Engine</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* ENGINE 1: DYNAMIC ROUTE OPTIMIZATION STUDIO */}
      {/* ========================================================================= */}
      {activeEngine === 'route' && (
        <div className="space-y-6">
          {/* Interactive Parameters Bar */}
          <div className="card p-5 border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm">
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 border border-slate-200 text-xs">
                <Sliders className="h-3.5 w-3.5 text-slate-500" />
                <span className="font-semibold text-slate-600">Shipment:</span>
                <span className="font-mono font-bold text-slate-900">{routeShipmentId}</span>
              </div>

              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 border border-slate-200 text-xs">
                <span className="font-semibold text-slate-600">Corridor:</span>
                <span className="font-bold text-slate-900">{routeOrigin} → {routeDest}</span>
              </div>
            </div>

            <button
              onClick={handleRunRouteOptimization}
              disabled={routeLoading}
              className="btn btn-primary inline-flex items-center gap-2 text-xs font-bold px-5 py-2.5 shadow-md shadow-blue-500/25 group"
            >
              <Sparkles className={`h-3.5 w-3.5 text-amber-300 transition-transform ${routeLoading ? 'animate-spin' : 'group-hover:rotate-12'}`} />
              <span>{routeLoading ? 'Calculating Paths...' : 'Solve Optimal Route'}</span>
            </button>
          </div>

          {/* Side-by-Side Dual Trajectory Comparison */}
          {routeResult && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* CURRENT TRAJECTORY */}
              <div className="card p-6 border-slate-200/90 relative overflow-hidden bg-slate-50/60 transition-all hover:shadow-md">
                <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-slate-400"></span>
                    <h3 className="text-sm font-bold uppercase tracking-wider text-slate-600">Current Assigned Route</h3>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-200 text-slate-700">
                    BASELINE
                  </span>
                </div>

                <div className="mt-4">
                  <h4 className="text-xl font-extrabold text-slate-900">{routeResult.current.name}</h4>
                  <p className="text-xs text-slate-500 mt-0.5">Route ID: {routeResult.current.route_id}</p>
                </div>

                <div className="mt-6 grid grid-cols-2 gap-4">
                  <div className="p-3 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
                    <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                      <Clock className="h-3.5 w-3.5 text-slate-400" />
                      <span>Duration</span>
                    </div>
                    <p className="text-xl font-black text-slate-900 mt-1">{routeResult.current.duration_hours} hrs</p>
                  </div>

                  <div className="p-3 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
                    <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                      <Navigation className="h-3.5 w-3.5 text-slate-400" />
                      <span>Distance</span>
                    </div>
                    <p className="text-xl font-black text-slate-900 mt-1">{routeResult.current.distance_km} km</p>
                  </div>

                  <div className="p-3 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
                    <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                      <DollarSign className="h-3.5 w-3.5 text-slate-400" />
                      <span>Fuel Cost</span>
                    </div>
                    <p className="text-xl font-black text-slate-900 mt-1">{formatCurrency(routeResult.current.fuel_cost)}</p>
                  </div>

                  <div className="p-3 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
                    <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                      <ShieldAlert className="h-3.5 w-3.5 text-rose-500" />
                      <span>Delay Risk</span>
                    </div>
                    <p className="text-xl font-black text-rose-600 mt-1">{routeResult.current.delay_risk}%</p>
                  </div>
                </div>
              </div>

              {/* AI RECOMMENDED ROUTE (Glow Card with Highlights) */}
              <div className="card p-6 border-blue-200 relative overflow-hidden bg-gradient-to-b from-blue-50/50 to-white shadow-md hover:shadow-lg transition-all ai-glow-card">
                <div className="flex items-center justify-between pb-3 border-b border-blue-100">
                  <div className="flex items-center gap-2">
                    <span className="relative flex h-2.5 w-2.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-blue-600"></span>
                    </span>
                    <h3 className="text-sm font-bold uppercase tracking-wider text-blue-700 flex items-center gap-1">
                      <Sparkles className="h-3.5 w-3.5" /> AI Recommended Path
                    </h3>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-blue-600 text-white shadow-xs">
                    OPTIMIZED
                  </span>
                </div>

                <div className="mt-4 flex items-start justify-between">
                  <div>
                    <h4 className="text-xl font-extrabold text-blue-950">{routeResult.recommended.name}</h4>
                    <p className="text-xs text-blue-600 font-medium mt-0.5">Route ID: {routeResult.recommended.route_id}</p>
                  </div>
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-100/80 px-2.5 py-1 rounded-full border border-emerald-200">
                    -{routeResult.improvement.cost_pct}% Cost
                  </span>
                </div>

                <div className="mt-6 grid grid-cols-2 gap-4">
                  <div className="p-3 rounded-2xl bg-white border border-blue-100 shadow-xs">
                    <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
                      <div className="flex items-center gap-1.5">
                        <Clock className="h-3.5 w-3.5 text-blue-600" />
                        <span>Duration</span>
                      </div>
                      <span className="text-[10px] font-bold text-emerald-600">-{routeResult.improvement.duration_hours}h</span>
                    </div>
                    <p className="text-xl font-black text-slate-900 mt-1">{routeResult.recommended.duration_hours} hrs</p>
                  </div>

                  <div className="p-3 rounded-2xl bg-white border border-blue-100 shadow-xs">
                    <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
                      <div className="flex items-center gap-1.5">
                        <Navigation className="h-3.5 w-3.5 text-blue-600" />
                        <span>Distance</span>
                      </div>
                      <span className="text-[10px] font-bold text-emerald-600">-{routeResult.improvement.distance_km}km</span>
                    </div>
                    <p className="text-xl font-black text-slate-900 mt-1">{routeResult.recommended.distance_km} km</p>
                  </div>

                  <div className="p-3 rounded-2xl bg-white border border-blue-100 shadow-xs">
                    <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
                      <div className="flex items-center gap-1.5">
                        <DollarSign className="h-3.5 w-3.5 text-emerald-600" />
                        <span>Fuel Cost</span>
                      </div>
                      <span className="text-[10px] font-bold text-emerald-600">Save {formatCurrency(routeResult.improvement.cost_savings)}</span>
                    </div>
                    <p className="text-xl font-black text-emerald-700 mt-1">{formatCurrency(routeResult.recommended.fuel_cost)}</p>
                  </div>

                  <div className="p-3 rounded-2xl bg-white border border-blue-100 shadow-xs">
                    <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
                      <div className="flex items-center gap-1.5">
                        <ShieldAlert className="h-3.5 w-3.5 text-emerald-600" />
                        <span>Delay Risk</span>
                      </div>
                      <span className="text-[10px] font-bold text-emerald-600">-{routeResult.improvement.delay_risk_reduction}pp</span>
                    </div>
                    <p className="text-xl font-black text-emerald-600 mt-1">{routeResult.recommended.delay_risk}%</p>
                  </div>
                </div>

                <div className="mt-5 pt-4 border-t border-blue-100 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs text-blue-800 font-medium">
                    <CheckCircle className="h-4 w-4 text-emerald-600" />
                    <span>Dynamic bypass around highway congestion nodes</span>
                  </div>
                  <button className="btn btn-primary text-xs py-1.5 px-3.5 shadow-sm">
                    Deploy Plan
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Visual Optimization Gains Strip */}
          {routeResult && (
            <div className="rounded-3xl bg-gradient-to-r from-emerald-500 to-teal-600 p-6 text-white shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-white" />
                  <h4 className="text-sm font-bold uppercase tracking-wider text-white">Algorithmic Gains Breakdown</h4>
                </div>
                <span className="text-xs font-bold bg-white/20 px-2.5 py-0.5 rounded-full">
                  Verified Convergence
                </span>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
                <div className="bg-white/10 backdrop-blur-xs p-3.5 rounded-2xl border border-white/20">
                  <span className="text-[11px] text-emerald-100 block">Fuel Outlay Cut</span>
                  <div className="text-2xl font-black mt-0.5">{formatCurrency(routeResult.improvement.cost_savings)}</div>
                  <span className="text-[10px] text-emerald-200 mt-0.5 block">{routeResult.improvement.cost_pct}% net savings</span>
                </div>

                <div className="bg-white/10 backdrop-blur-xs p-3.5 rounded-2xl border border-white/20">
                  <span className="text-[11px] text-emerald-100 block">Transit Time Saved</span>
                  <div className="text-2xl font-black mt-0.5">{routeResult.improvement.duration_hours} Hours</div>
                  <span className="text-[10px] text-emerald-200 mt-0.5 block">{routeResult.improvement.duration_pct}% faster ETA</span>
                </div>

                <div className="bg-white/10 backdrop-blur-xs p-3.5 rounded-2xl border border-white/20">
                  <span className="text-[11px] text-emerald-100 block">Distance Trimmed</span>
                  <div className="text-2xl font-black mt-0.5">{routeResult.improvement.distance_km} km</div>
                  <span className="text-[10px] text-emerald-200 mt-0.5 block">{routeResult.improvement.distance_pct}% mileage cut</span>
                </div>

                <div className="bg-white/10 backdrop-blur-xs p-3.5 rounded-2xl border border-white/20">
                  <span className="text-[11px] text-emerald-100 block">Congestion Variance</span>
                  <div className="text-2xl font-black mt-0.5">-{routeResult.improvement.delay_risk_reduction}%</div>
                  <span className="text-[10px] text-emerald-200 mt-0.5 block">Zero toll choke points</span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* ENGINE 2: SMART FLEET ALLOCATION SOLVER */}
      {/* ========================================================================= */}
      {activeEngine === 'fleet' && (
        <div className="space-y-6">
          {/* Fleet Controls */}
          <div className="card p-5 border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Payload Weight Constraint:</span>
              <div className="flex items-center gap-2">
                <input 
                  type="number"
                  value={fleetWeight}
                  onChange={(e) => setFleetWeight(e.target.value)}
                  className="w-28 px-3 py-1.5 rounded-full border border-slate-200 text-xs font-mono font-bold text-slate-800"
                />
                <span className="text-xs font-semibold text-slate-500">kg</span>
              </div>
            </div>

            <button
              onClick={handleRunFleetOptimization}
              disabled={fleetLoading}
              className="btn btn-primary inline-flex items-center gap-2 text-xs font-bold px-5 py-2.5 shadow-md shadow-blue-500/25"
            >
              <Cpu className={`h-3.5 w-3.5 ${fleetLoading ? 'animate-spin' : ''}`} />
              <span>{fleetLoading ? 'Evaluating Fleet Mesh...' : 'Solve Carrier Match'}</span>
            </button>
          </div>

          {fleetResult && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Recommended Vehicle Card */}
              <div className="card p-6 border-blue-200 lg:col-span-2 bg-gradient-to-b from-blue-50/40 to-white shadow-md ai-glow-card relative">
                <div className="flex items-center justify-between pb-3 border-b border-blue-100">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-blue-600 animate-ping"></span>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-blue-700">Highest Efficiency Vehicle Match</h3>
                  </div>
                  <span className="text-xs font-extrabold bg-blue-600 text-white px-3 py-0.5 rounded-full">
                    SCORE: {fleetResult.recommended.score?.toFixed(2)}
                  </span>
                </div>

                <div className="mt-5 flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-2xl bg-blue-600 text-white shadow-md">
                      <Truck className="h-6 w-6" />
                    </div>
                    <div>
                      <h4 className="text-2xl font-extrabold text-slate-900">{fleetResult.recommended.id}</h4>
                      <p className="text-xs text-slate-500">{fleetResult.recommended.type} • Driver: <strong className="text-slate-800">{fleetResult.recommended.driver_name}</strong></p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100">
                      Save ₹{fleetResult.estimated_savings} vs Next Best
                    </span>
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-3 gap-3">
                  <div className="p-3 rounded-xl bg-white border border-blue-100">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Payload Match</span>
                    <p className="text-lg font-black text-slate-900 mt-0.5">{fleetWeight} / {fleetResult.recommended.capacity_kg} kg</p>
                    <span className="text-[10px] text-blue-600 font-semibold">{fleetResult.recommended.capacity_utilization}% capacity utilization</span>
                  </div>

                  <div className="p-3 rounded-xl bg-white border border-blue-100">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Fuel Efficiency</span>
                    <p className="text-lg font-black text-slate-900 mt-0.5">{fleetResult.recommended.fuel_efficiency} km/L</p>
                    <span className="text-[10px] text-emerald-600 font-semibold">Low consumption</span>
                  </div>

                  <div className="p-3 rounded-xl bg-white border border-blue-100">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Estimated Run Cost</span>
                    <p className="text-lg font-black text-slate-900 mt-0.5">{formatCurrency(fleetResult.recommended.estimated_fuel_cost)}</p>
                    <span className="text-[10px] text-slate-500">{fleetResult.recommended.estimated_distance} km deadhead</span>
                  </div>
                </div>

                <div className="mt-5 p-3 rounded-xl bg-blue-50/80 border border-blue-100 text-xs text-blue-900 flex items-center justify-between">
                  <span>{fleetResult.reason}</span>
                  <button className="btn btn-primary text-xs py-1.5 px-3.5 shrink-0 ml-3">
                    Assign Fleet
                  </button>
                </div>
              </div>

              {/* Runner-Up Alternatives */}
              <div className="card p-5 border-slate-100 shadow-sm space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 pb-2 border-b border-slate-100">
                  Alternative Candidates ({fleetResult.alternatives?.length || 0})
                </h4>

                {fleetResult.alternatives?.map((alt, idx) => (
                  <div key={alt.id} className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono font-bold text-slate-900">{alt.id}</span>
                        <span className="text-[10px] text-slate-500">({alt.type})</span>
                      </div>
                      <span className="text-[10px] text-slate-400">Driver: {alt.driver_name}</span>
                    </div>
                    <div className="text-right">
                      <span className="font-bold text-slate-800">{formatCurrency(alt.estimated_fuel_cost)}</span>
                      <span className="block text-[10px] text-slate-400 font-mono">Score: {alt.score.toFixed(2)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* ENGINE 3: MULTI-MODAL & CO2 EMISSIONS ENGINE */}
      {/* ========================================================================= */}
      {activeEngine === 'multimodal' && (
        <div className="space-y-6">
          {/* Multimodal Controls */}
          <div className="card p-5 border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
            <div className="flex flex-wrap items-center gap-3 text-xs">
              <span className="font-bold uppercase tracking-wider text-slate-500">Corridor:</span>
              <span className="font-bold text-slate-900 bg-slate-100 px-3 py-1 rounded-full">{modalOrigin} → {modalDest}</span>
              <span className="font-bold uppercase tracking-wider text-slate-500 ml-2">Weight:</span>
              <span className="font-bold text-slate-900 bg-slate-100 px-3 py-1 rounded-full">{modalWeight} kg</span>
            </div>

            <button
              onClick={handleRunMultimodalOptimization}
              disabled={modalLoading}
              className="btn btn-primary inline-flex items-center gap-2 text-xs font-bold px-5 py-2.5 shadow-md shadow-blue-500/25"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${modalLoading ? 'animate-spin' : ''}`} />
              <span>{modalLoading ? 'Comparing Modalities...' : 'Simulate Transport Modes'}</span>
            </button>
          </div>

          {modalResult && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {modalResult.modes?.map((mode) => {
                const isRoad = mode.mode === 'road';
                const isRail = mode.mode === 'rail';
                const isAir = mode.mode === 'air';

                return (
                  <div 
                    key={mode.mode}
                    className={`card p-6 border transition-all duration-300 relative overflow-hidden ${
                      isRoad 
                        ? 'border-blue-400 shadow-md ring-2 ring-blue-500/20 bg-gradient-to-b from-blue-50/30 to-white' 
                        : 'border-slate-100 shadow-sm hover:shadow-md'
                    }`}
                  >
                    {isRoad && (
                      <div className="absolute top-0 right-0 bg-blue-600 text-white text-[10px] font-extrabold uppercase px-3 py-1 rounded-bl-xl">
                        AI Recommended
                      </div>
                    )}

                    <div className="flex items-center gap-3 mb-4">
                      <div className={`p-3 rounded-2xl ${
                        isRoad ? 'bg-blue-600 text-white' :
                        isRail ? 'bg-emerald-600 text-white' :
                        'bg-indigo-600 text-white'
                      }`}>
                        {isRoad && <Truck className="h-6 w-6" />}
                        {isRail && <Train className="h-6 w-6" />}
                        {isAir && <Plane className="h-6 w-6" />}
                      </div>
                      <div>
                        <h4 className="text-lg font-black text-slate-900 capitalize">{mode.mode} Freight</h4>
                        <span className="text-[11px] font-semibold text-slate-500">
                          {isRoad ? 'Express Highway' : isRail ? 'Dedicated Rail Corridor' : 'Air Cargo Express'}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-3 pt-3 border-t border-slate-100 text-xs">
                      <div className="flex justify-between">
                        <span className="text-slate-500">Freight Outlay:</span>
                        <span className="font-extrabold text-slate-900">{formatCurrency(mode.cost)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Transit Duration:</span>
                        <span className="font-extrabold text-slate-900">{mode.duration_hours?.toFixed(1)} Hours</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-500 flex items-center gap-1">
                          <Leaf className="h-3.5 w-3.5 text-emerald-500" />
                          CO₂ Footprint:
                        </span>
                        <span className="font-extrabold text-slate-800">{mode.co2_emissions} kg CO₂</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-500">Transit Risk:</span>
                        <span className={`px-2 py-0.5 rounded-full font-bold uppercase text-[10px] ${
                          mode.risk === 'low' || mode.risk === 'very_low' 
                            ? 'bg-emerald-100 text-emerald-700' 
                            : 'bg-amber-100 text-amber-700'
                        }`}>
                          {mode.risk.replace('_', ' ')}
                        </span>
                      </div>
                    </div>

                    <div className="mt-5 pt-4 border-t border-slate-100">
                      <button className={`w-full btn text-xs py-2 ${isRoad ? 'btn-primary' : 'btn-secondary'}`}>
                        Select {mode.mode}
                      </button>
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

/**
 * Interactive Antigravity Particle Field Canvas
 * Inspired by Google Antigravity IDE dynamics:
 * Features floating particles, interactive mouse levitation/repulsion force field,
 * dynamic constellation connections, and an ambient cursor spotlight.
 */
function AntigravityBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    const parent = canvas.parentElement;
    if (!parent) return;

    let width = (canvas.width = parent.offsetWidth);
    let height = (canvas.height = parent.offsetHeight);

    const handleResize = () => {
      if (!canvas || !parent) return;
      width = canvas.width = parent.offsetWidth;
      height = canvas.height = parent.offsetHeight;
    };

    window.addEventListener('resize', handleResize);

    const mouse = { x: -1000, y: -1000, active: false };

    const handleMouseMove = (e) => {
      const rect = parent.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
      mouse.active = true;
    };

    const handleMouseLeave = () => {
      mouse.active = false;
      mouse.x = -1000;
      mouse.y = -1000;
    };

    parent.addEventListener('mousemove', handleMouseMove);
    parent.addEventListener('mouseleave', handleMouseLeave);

    // Initialize quantum particle nodes
    const particleCount = Math.min(65, Math.max(35, Math.floor((width * height) / 9500)));
    const particles = Array.from({ length: particleCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
      radius: Math.random() * 1.6 + 1.2,
      baseAlpha: Math.random() * 0.45 + 0.35,
      color: Math.random() > 0.4 ? '56, 189, 248' : '129, 140, 248', // Cyan or Indigo
    }));

    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      // Interactive mouse gravitational glow
      if (mouse.active) {
        const glow = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, 160);
        glow.addColorStop(0, 'rgba(56, 189, 248, 0.16)');
        glow.addColorStop(0.5, 'rgba(99, 102, 241, 0.06)');
        glow.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(mouse.x, mouse.y, 160, 0, Math.PI * 2);
        ctx.fill();
      }

      // Update and draw particles with interactive physics
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Inertial velocity drift
        p.x += p.vx;
        p.y += p.vy;

        // Soft bounce boundaries
        if (p.x < 0) { p.x = 0; p.vx *= -1; }
        if (p.x > width) { p.x = width; p.vx *= -1; }
        if (p.y < 0) { p.y = 0; p.vy *= -1; }
        if (p.y > height) { p.y = height; p.vy *= -1; }

        // Interactive mouse antigravity force (Levitates / repels away from cursor)
        if (mouse.active) {
          const dx = p.x - mouse.x;
          const dy = p.y - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const maxDist = 135;
          if (dist < maxDist && dist > 0) {
            const force = (maxDist - dist) / maxDist;
            p.x += (dx / dist) * force * 2.5;
            p.y += (dy / dist) * force * 2.5;
          }
        }

        // Render particle node
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${p.color}, ${p.baseAlpha})`;
        ctx.fill();

        // Connect nearby nodes with subtle constellation lines
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dist2 = Math.hypot(p.x - p2.x, p.y - p2.y);
          if (dist2 < 85) {
            const lineAlpha = (1 - dist2 / 85) * 0.16;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(147, 197, 253, ${lineAlpha})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      parent.removeEventListener('mousemove', handleMouseMove);
      parent.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      className="absolute inset-0 w-full h-full pointer-events-none z-0" 
    />
  );
}

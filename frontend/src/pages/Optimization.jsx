import { useState } from 'react';
import { Zap, TrendingUp, ArrowRight } from 'lucide-react';
import { api } from '../services/api';

export default function Optimization() {
  const [routeOptimization, setRouteOptimization] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleOptimizeRoute = async () => {
    setLoading(true);
    try {
      const result = await api.optimizeRoute({
        shipment_id: 'SHP-1048',
        origin: 'Mumbai',
        destination: 'Pune'
      });
      setRouteOptimization(result);
    } catch (error) {
      console.error('Route optimization failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="card p-6">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">AI Route & Fleet Optimizer</h2>
            <p className="mt-1 text-sm text-gray-600">
              Intelligent optimization engine for routes, fleet allocation, and multi-modal transport
            </p>
          </div>
          <Zap className="h-10 w-10 text-primary-600" />
        </div>
      </div>

      {/* Demo Optimization */}
      <div className="card p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Demo: Optimize Shipment SHP-1048</h3>
        
        <button
          onClick={handleOptimizeRoute}
          disabled={loading}
          className="btn btn-primary mb-6"
        >
          {loading ? 'Optimizing...' : 'Run Route Optimization'}
        </button>

        {routeOptimization && (
          <div className="space-y-6">
            {/* Comparison */}
            <div className="grid grid-cols-2 gap-6">
              {/* Current Plan */}
              <div className="border-2 border-gray-300 rounded-lg p-6">
                <h4 className="text-lg font-bold text-gray-900 mb-4">Current Plan</h4>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-600">Route</p>
                    <p className="text-lg font-semibold text-gray-900">{routeOptimization.current.name}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-gray-600">Distance</p>
                      <p className="text-lg font-bold text-gray-900">{routeOptimization.current.distance_km} km</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600">Duration</p>
                      <p className="text-lg font-bold text-gray-900">{routeOptimization.current.duration_hours}h</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-gray-600">Cost</p>
                      <p className="text-lg font-bold text-gray-900">₹{routeOptimization.current.fuel_cost.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600">Delay Risk</p>
                      <p className="text-lg font-bold text-danger-600">{routeOptimization.current.delay_risk}%</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* AI Recommended */}
              <div className="border-2 border-primary-500 rounded-lg p-6 bg-primary-50">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-lg font-bold text-gray-900">AI Recommended</h4>
                  <span className="badge badge-info">OPTIMIZED</span>
                </div>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-600">Route</p>
                    <p className="text-lg font-semibold text-gray-900">{routeOptimization.recommended.name}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-gray-600">Distance</p>
                      <p className="text-lg font-bold text-gray-900">{routeOptimization.recommended.distance_km} km</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600">Duration</p>
                      <p className="text-lg font-bold text-gray-900">{routeOptimization.recommended.duration_hours}h</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-gray-600">Cost</p>
                      <p className="text-lg font-bold text-gray-900">₹{routeOptimization.recommended.fuel_cost.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600">Delay Risk</p>
                      <p className="text-lg font-bold text-success-600">{routeOptimization.recommended.delay_risk}%</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Impact Summary */}
            <div className="bg-gradient-to-r from-success-50 to-primary-50 rounded-lg p-6 border border-success-200">
              <h4 className="text-lg font-bold text-gray-900 mb-4">Optimization Impact</h4>
              <div className="grid grid-cols-4 gap-6">
                <div>
                  <p className="text-sm text-gray-600">Cost Savings</p>
                  <p className="text-2xl font-bold text-success-600">₹{routeOptimization.improvement.cost_savings.toLocaleString()}</p>
                  <p className="text-xs text-gray-600 mt-1">{routeOptimization.improvement.cost_pct}% reduction</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Time Saved</p>
                  <p className="text-2xl font-bold text-primary-600">{routeOptimization.improvement.duration_hours}h</p>
                  <p className="text-xs text-gray-600 mt-1">{routeOptimization.improvement.duration_pct}% faster</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Distance Reduction</p>
                  <p className="text-2xl font-bold text-primary-600">{routeOptimization.improvement.distance_km} km</p>
                  <p className="text-xs text-gray-600 mt-1">{routeOptimization.improvement.distance_pct}% shorter</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Risk Reduction</p>
                  <p className="text-2xl font-bold text-success-600">{routeOptimization.improvement.delay_risk_reduction} pp</p>
                  <p className="text-xs text-gray-600 mt-1">Lower delay risk</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

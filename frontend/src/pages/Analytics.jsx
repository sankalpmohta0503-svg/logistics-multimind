import { useState, useEffect } from 'react';
import { TrendingUp, AlertCircle } from 'lucide-react';
import { api } from '../services/api';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';

export default function Analytics() {
  const [demandForecast, setDemandForecast] = useState([]);
  const [delayPredictions, setDelayPredictions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    try {
      const [demand, delays] = await Promise.all([
        api.getDemandForecast({ days: 30 }),
        api.getDelayPredictions()
      ]);
      setDemandForecast(demand);
      setDelayPredictions(delays);
    } catch (error) {
      console.error('Failed to load analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64">Loading analytics...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="card p-6">
        <h2 className="text-2xl font-bold text-gray-900">Predictive Analytics Center</h2>
        <p className="mt-1 text-sm text-gray-600">
          AI-powered forecasting and prediction for demand, delays, costs, and capacity
        </p>
      </div>

      {/* Demand Forecasting */}
      {demandForecast.length > 0 && (
        <div className="card p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold text-gray-900">Demand Forecast - {demandForecast[0].name}</h3>
              <p className="text-sm text-gray-600 mt-1">
                30-day demand prediction with confidence intervals
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">Forecast Accuracy</p>
              <p className="text-2xl font-bold text-success-600">{demandForecast[0].accuracy}%</p>
            </div>
          </div>

          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={demandForecast[0].forecast}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} />
              <YAxis />
              <Tooltip />
              <Area 
                type="monotone" 
                dataKey="upper_bound" 
                stackId="1"
                stroke="none" 
                fill="#dbeafe" 
                fillOpacity={0.6}
              />
              <Area 
                type="monotone" 
                dataKey="predicted" 
                stackId="2"
                stroke="#3b82f6" 
                fill="#3b82f6" 
                fillOpacity={0.4}
              />
              <Area 
                type="monotone" 
                dataKey="lower_bound" 
                stackId="3"
                stroke="none" 
                fill="#dbeafe" 
                fillOpacity={0.6}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Delay Predictions */}
      <div className="card p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Shipment Delay Prediction</h3>
        
        <div className="space-y-3">
          {delayPredictions.slice(0, 10).map((pred) => (
            <div key={pred.shipment_id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div className="flex items-center space-x-4">
                <AlertCircle className={`h-5 w-5 ${
                  pred.risk_level === 'high' ? 'text-danger-600' :
                  pred.risk_level === 'medium' ? 'text-warning-600' :
                  'text-success-600'
                }`} />
                <div>
                  <p className="font-medium text-gray-900">{pred.shipment_id}</p>
                  <p className="text-sm text-gray-600">{pred.destination}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-6">
                <div>
                  <p className="text-xs text-gray-600">Delay Probability</p>
                  <p className={`text-lg font-bold ${
                    pred.delay_probability > 70 ? 'text-danger-600' :
                    pred.delay_probability > 40 ? 'text-warning-600' :
                    'text-success-600'
                  }`}>
                    {pred.delay_probability}%
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-600">ETA</p>
                  <p className="text-sm text-gray-900">
                    {pred.eta ? new Date(pred.eta).toLocaleString() : 'TBD'}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

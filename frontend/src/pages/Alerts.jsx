import { useState, useEffect } from 'react';
import { Bell, AlertTriangle, AlertCircle, Info } from 'lucide-react';
import StatusBadge from '../components/StatusBadge';
import { api } from '../services/api';

export default function Alerts() {
  const [alerts, setAlerts] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAlerts();
  }, []);

  const loadAlerts = async () => {
    try {
      const [alertsData, recsData] = await Promise.all([
        api.getAlerts({ resolved: 'false' }),
        api.getRecommendations()
      ]);
      setAlerts(alertsData);
      setRecommendations(recsData);
    } catch (error) {
      console.error('Failed to load alerts:', error);
    } finally {
      setLoading(false);
    }
  };

  const getIcon = (severity) => {
    switch (severity) {
      case 'critical':
        return AlertTriangle;
      case 'high':
        return AlertCircle;
      default:
        return Info;
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64">Loading alerts...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="card p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Insights & Alerts</h2>
            <p className="mt-1 text-sm text-gray-600">
              {alerts.length} active alerts • {recommendations.length} AI recommendations
            </p>
          </div>
          <Bell className="h-10 w-10 text-primary-600" />
        </div>
      </div>

      {/* Critical Alerts */}
      <div className="card p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Active Alerts</h3>
        <div className="space-y-4">
          {alerts.map((alert) => {
            const Icon = getIcon(alert.severity);
            return (
              <div key={alert.id} className="flex items-start justify-between p-5 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex items-start space-x-4">
                  <Icon className={`h-6 w-6 mt-1 ${
                    alert.severity === 'critical' ? 'text-danger-600' :
                    alert.severity === 'high' ? 'text-warning-600' :
                    'text-primary-600'
                  }`} />
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <h4 className="font-bold text-gray-900">{alert.title}</h4>
                      <StatusBadge status={alert.severity} />
                    </div>
                    <p className="text-sm text-gray-600 mt-2">{alert.description}</p>
                    <p className="text-xs text-gray-500 mt-3">
                      {new Date(alert.created_at).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* AI Recommendations */}
      <div className="card p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">AI Recommendations</h3>
        <div className="space-y-4">
          {recommendations.map((rec) => (
            <div key={rec.id} className="p-5 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg border border-purple-200">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3">
                    <h4 className="font-bold text-gray-900">{rec.title}</h4>
                    <StatusBadge status={rec.priority} />
                  </div>
                  <p className="text-sm text-gray-700 mt-2">{rec.description}</p>
                  
                  {rec.estimated_savings && (
                    <div className="mt-4 flex items-center space-x-6">
                      <div>
                        <p className="text-xs text-gray-600">Estimated Savings</p>
                        <p className="text-lg font-bold text-success-600">₹{rec.estimated_savings.toLocaleString()}</p>
                      </div>
                      {rec.estimated_time_savings && (
                        <div>
                          <p className="text-xs text-gray-600">Time Savings</p>
                          <p className="text-lg font-bold text-primary-600">{rec.estimated_time_savings}h</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

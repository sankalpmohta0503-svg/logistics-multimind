import { useState, useEffect } from 'react';
import { Package, TrendingUp, Truck, AlertTriangle, DollarSign, Clock, Ship, Warehouse } from 'lucide-react';
import KPICard from '../components/KPICard';
import AIDecisionCard from '../components/AIDecisionCard';
import StatusBadge from '../components/StatusBadge';
import { api } from '../services/api';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

export default function CommandCenter() {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const data = await api.getDashboard();
      setDashboardData(data);
    } catch (error) {
      console.error('Failed to load dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApplyRecommendation = async (id) => {
    try {
      await api.applyRecommendation(id);
      loadDashboard(); // Reload dashboard
      alert('Recommendation applied successfully!');
    } catch (error) {
      console.error('Failed to apply recommendation:', error);
      alert('Failed to apply recommendation');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-gray-600">Loading command center...</div>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-danger-600">Failed to load dashboard data</div>
      </div>
    );
  }

  const { kpis, healthScore, healthStatus, alerts, recommendations } = dashboardData;

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="card p-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Supply Chain Command Center</h1>
            <p className="mt-1 text-sm text-gray-600">AI-powered operational visibility and decision support</p>
          </div>
          <div className="text-right">
            <div className="flex items-center space-x-3">
              <div>
                <p className="text-sm text-gray-600">Supply Chain Health</p>
                <div className="flex items-center mt-1">
                  <span className="text-3xl font-bold text-gray-900">{healthScore}</span>
                  <span className="text-lg text-gray-600">/100</span>
                </div>
              </div>
              <div>
                <StatusBadge status={healthStatus} />
              </div>
            </div>
            <p className="mt-2 text-xs text-gray-500">
              {alerts.filter(a => a.severity === 'critical' || a.severity === 'high').length} emerging risks detected
            </p>
          </div>
        </div>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard
          title="Total Shipments"
          value={kpis.totalShipments.toLocaleString()}
          icon={Ship}
          color="primary"
          trend={{ direction: 'up', value: '+12%', label: 'vs last month' }}
        />
        <KPICard
          title="On-Time Delivery"
          value={`${kpis.onTimeDelivery}%`}
          icon={Clock}
          color="success"
          trend={{ direction: 'up', value: '+2.3%', label: 'vs last month' }}
        />
        <KPICard
          title="Inventory Health"
          value={`${kpis.inventoryHealth}%`}
          icon={Package}
          color="success"
          trend={{ direction: 'neutral', value: '-0.5%', label: 'vs last month' }}
        />
        <KPICard
          title="Fleet Utilization"
          value={`${kpis.fleetUtilization}%`}
          icon={Truck}
          color="warning"
          trend={{ direction: 'down', value: '-3.2%', label: 'vs last month' }}
        />
      </div>

      {/* Second KPI Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard
          title="Logistics Cost"
          value={`₹${(kpis.logisticsCost / 100000).toFixed(1)}L`}
          subtitle="Last 30 days"
          icon={DollarSign}
          color="primary"
        />
        <KPICard
          title="Projected Savings"
          value={`₹${(kpis.projectedSavings / 100000).toFixed(1)}L`}
          subtitle="AI-identified opportunities"
          icon={TrendingUp}
          color="success"
        />
        <KPICard
          title="At-Risk Shipments"
          value={kpis.atRiskShipments}
          subtitle="Delay probability > 50%"
          icon={AlertTriangle}
          color="danger"
        />
        <KPICard
          title="Stockout Risks"
          value={kpis.stockoutRisks}
          subtitle="Below reorder point"
          icon={Warehouse}
          color="warning"
        />
      </div>

      {/* AI Operations Brief */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold text-gray-900">AI Operations Brief</h2>
            <p className="text-sm text-gray-600 mt-1">
              {recommendations.length} high-impact decisions require attention
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {recommendations.slice(0, 3).map((rec) => {
            // Parse recommendation data
            const recData = parseRecommendation(rec);
            
            return (
              <AIDecisionCard
                key={rec.id}
                severity={rec.priority}
                title={rec.title}
                description={rec.description}
                reason={recData.reasons}
                recommendation={recData.recommendation}
                impact={recData.impact}
                onApply={() => handleApplyRecommendation(rec.id)}
              />
            );
          })}
        </div>
      </div>

      {/* Critical Alerts */}
      {alerts.filter(a => a.severity === 'critical' || a.severity === 'high').length > 0 && (
        <div className="card p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Critical Alerts</h2>
          <div className="space-y-3">
            {alerts
              .filter(a => a.severity === 'critical' || a.severity === 'high')
              .slice(0, 5)
              .map((alert) => (
                <div key={alert.id} className="flex items-start justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="flex items-start space-x-3">
                    <AlertTriangle className={`h-5 w-5 mt-0.5 ${alert.severity === 'critical' ? 'text-danger-600' : 'text-warning-600'}`} />
                    <div>
                      <h3 className="font-medium text-gray-900">{alert.title}</h3>
                      <p className="text-sm text-gray-600 mt-1">{alert.description}</p>
                      <p className="text-xs text-gray-500 mt-2">
                        {new Date(alert.created_at).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <StatusBadge status={alert.severity} />
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}

function parseRecommendation(rec) {
  // Parse recommendation to extract structured data
  const reasons = [];
  const impact = {};
  
  if (rec.type === 'route_optimization') {
    reasons.push('Current route has high congestion');
    reasons.push('Alternative route available with better efficiency');
    impact.cost = `₹${(rec.estimated_savings || 0).toLocaleString()}`;
    impact.time = `${(rec.estimated_time_savings || 0).toFixed(1)}h`;
    impact.risk = '-19 pp';
  } else if (rec.type === 'inventory_reorder') {
    reasons.push('Stock level below reorder point');
    reasons.push('High stockout probability based on demand forecast');
    impact.risk = '71% → 12%';
  } else if (rec.type === 'warehouse_redistribution') {
    reasons.push('Warehouse approaching capacity limit');
    reasons.push('Nearby warehouse has available space');
    impact.efficiency = '94% → 78%';
    impact.cost = `₹${(rec.estimated_savings || 0).toLocaleString()}`;
  }
  
  return {
    reasons,
    recommendation: rec.title,
    impact
  };
}

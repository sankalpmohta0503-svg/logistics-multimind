import { useState, useEffect } from 'react';
import { FileText, Download, TrendingUp } from 'lucide-react';
import { api } from '../services/api';

export default function Reports() {
  const [executiveReport, setExecutiveReport] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadReports();
  }, []);

  const loadReports = async () => {
    try {
      const report = await api.getExecutiveReport();
      setExecutiveReport(report);
    } catch (error) {
      console.error('Failed to load reports:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64">Loading reports...</div>;
  }

  if (!executiveReport) return null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="card p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Executive Report</h2>
            <p className="mt-1 text-sm text-gray-600">
              Generated: {new Date(executiveReport.generated_at).toLocaleString()}
            </p>
          </div>
          <button className="btn btn-primary flex items-center">
            <Download className="h-5 w-5 mr-2" />
            Export Report
          </button>
        </div>
      </div>

      {/* Executive Summary */}
      <div className="card p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Executive Summary</h3>
        <div className="grid grid-cols-4 gap-6">
          <div>
            <p className="text-sm text-gray-600">Total Shipments</p>
            <p className="text-3xl font-bold text-gray-900 mt-2">{executiveReport.overview.total_shipments}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Total Cost</p>
            <p className="text-3xl font-bold text-gray-900 mt-2">
              ₹{(executiveReport.overview.total_cost / 100000).toFixed(1)}L
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">On-Time Rate</p>
            <p className="text-3xl font-bold text-success-600 mt-2">{executiveReport.overview.on_time_rate}%</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Fleet Utilization</p>
            <p className="text-3xl font-bold text-primary-600 mt-2">{executiveReport.overview.fleet_utilization}%</p>
          </div>
        </div>
      </div>

      {/* Savings Potential */}
      <div className="card p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">AI-Identified Savings Potential</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-success-50 rounded-lg border border-success-200">
            <div>
              <p className="font-medium text-gray-900">Route Optimization</p>
              <p className="text-sm text-gray-600 mt-1">Optimize delivery routes and vehicle allocation</p>
            </div>
            <p className="text-2xl font-bold text-success-600">
              ₹{(executiveReport.savings_potential.route_optimization / 100000).toFixed(1)}L
            </p>
          </div>
          
          <div className="flex items-center justify-between p-4 bg-primary-50 rounded-lg border border-primary-200">
            <div>
              <p className="font-medium text-gray-900">Inventory Optimization</p>
              <p className="text-sm text-gray-600 mt-1">Reduce stockouts and overstock situations</p>
            </div>
            <p className="text-2xl font-bold text-primary-600">
              ₹{(executiveReport.savings_potential.inventory_optimization / 100000).toFixed(1)}L
            </p>
          </div>
          
          <div className="flex items-center justify-between p-4 bg-purple-50 rounded-lg border border-purple-200">
            <div>
              <p className="font-medium text-gray-900">Fleet Allocation</p>
              <p className="text-sm text-gray-600 mt-1">Improve vehicle utilization and fuel efficiency</p>
            </div>
            <p className="text-2xl font-bold text-purple-600">
              ₹{(executiveReport.savings_potential.fleet_allocation / 100000).toFixed(1)}L
            </p>
          </div>
          
          <div className="flex items-center justify-between p-4 bg-warning-50 rounded-lg border border-warning-200">
            <div>
              <p className="font-medium text-gray-900">Warehouse Optimization</p>
              <p className="text-sm text-gray-600 mt-1">Optimize capacity and inventory distribution</p>
            </div>
            <p className="text-2xl font-bold text-warning-600">
              ₹{(executiveReport.savings_potential.warehouse_optimization / 100000).toFixed(1)}L
            </p>
          </div>
          
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <p className="text-lg font-bold text-gray-900">Total Savings Potential</p>
              <p className="text-3xl font-bold text-success-600">
                ₹{(executiveReport.savings_potential.total / 100000).toFixed(1)}L
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="card p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Performance Metrics</h3>
        <div className="grid grid-cols-3 gap-6">
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600">Shipments at Risk</p>
            <p className="text-2xl font-bold text-danger-600 mt-2">{executiveReport.performance.shipments_at_risk}</p>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600">Stockout Risks</p>
            <p className="text-2xl font-bold text-warning-600 mt-2">{executiveReport.performance.stockout_risks}</p>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600">Avg Warehouse Capacity</p>
            <p className="text-2xl font-bold text-primary-600 mt-2">
              {executiveReport.performance.warehouse_capacity_avg.toFixed(1)}%
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
